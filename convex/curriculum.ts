import { v } from 'convex/values';
import { query } from './_generated/server';
import type { QueryCtx } from './_generated/server';
import type { Doc, Id } from './_generated/dataModel';
import { requireMembership } from './authz';
import { conceptStatus } from './schema';

// Global curriculum reads. All require a signed-in profile + a valid membership
// (curriculum data is global, served to every member). Normal users only ever
// see `status:"published"` concepts; drafts/archived stay hidden until an
// admin-only extension. Year stages, topics and concepts are ALWAYS ordered by
// orderIndex (never alphabetical / creation order).

const PUBLISHED = 'published' as const;
const MAX_THREAD_HOPS = 6;
const RELATED_EDGE_TYPES = new Set([
  'related',
  'application',
  'revisits',
  'extends',
  'misconception_link',
]);

/** Confirms the caller is signed in with a valid membership. Returns the context. */
async function requireReader(ctx: QueryCtx) {
  return await requireMembership(ctx);
}

/** Loads concept ids → published concept docs, deduped, ordered by orderIndex. */
async function loadPublishedConcepts(
  ctx: QueryCtx,
  ids: Id<'concepts'>[],
): Promise<Doc<'concepts'>[]> {
  const out: Doc<'concepts'>[] = [];
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const concept = await ctx.db.get(id);
    if (concept && concept.status === PUBLISHED) out.push(concept);
  }
  return out.sort((a, b) => a.orderIndex - b.orderIndex);
}

export const listSubjects = query({
  args: {},
  handler: async (ctx) => {
    await requireReader(ctx);
    const subjects = await ctx.db.query('subjects').take(100);
    return subjects.sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const listYearStages = query({
  args: {},
  handler: async (ctx) => {
    await requireReader(ctx);
    const stages = await ctx.db.query('yearStages').take(100);
    return stages.sort((a, b) => a.orderIndex - b.orderIndex);
  },
});

export const listTopicsBySubject = query({
  args: {
    subjectId: v.id('subjects'),
    yearStageId: v.optional(v.id('yearStages')),
  },
  handler: async (ctx, args) => {
    await requireReader(ctx);
    // by_subject_stage_order orders by [yearStageId, orderIndex]; with a fixed
    // yearStageId it collapses to orderIndex order.
    const topics = await ctx.db
      .query('topics')
      .withIndex('by_subject_stage_order', (q) =>
        args.yearStageId
          ? q.eq('subjectId', args.subjectId).eq('yearStageId', args.yearStageId)
          : q.eq('subjectId', args.subjectId),
      )
      .take(500);
    return topics;
  },
});

export const listConceptsBySubject = query({
  args: { subjectId: v.id('subjects') },
  handler: async (ctx, args) => {
    await requireReader(ctx);
    const concepts = await ctx.db
      .query('concepts')
      .withIndex('by_subject', (q) => q.eq('subjectId', args.subjectId))
      .take(1000);
    return concepts
      .filter((c) => c.status === PUBLISHED)
      .sort((a, b) => a.orderIndex - b.orderIndex);
  },
});

export const listConceptsByTopic = query({
  args: { topicId: v.id('topics') },
  handler: async (ctx, args) => {
    await requireReader(ctx);
    // by_topic_order already returns in orderIndex order.
    const concepts = await ctx.db
      .query('concepts')
      .withIndex('by_topic_order', (q) => q.eq('topicId', args.topicId))
      .take(500);
    return concepts.filter((c) => c.status === PUBLISHED);
  },
});

export const getConceptById = query({
  args: { conceptId: v.id('concepts') },
  handler: async (ctx, args) => {
    await requireReader(ctx);
    const concept = await ctx.db.get(args.conceptId);
    if (!concept || concept.status !== PUBLISHED) return null;
    return concept;
  },
});

/** Prior treatment = incoming `next` + incoming `prerequisite` (edges INTO the concept). */
export const getPriorTreatment = query({
  args: { conceptId: v.id('concepts') },
  handler: async (ctx, args) => {
    await requireReader(ctx);
    const incoming = await ctx.db
      .query('conceptEdges')
      .withIndex('by_to', (q) => q.eq('toConceptId', args.conceptId))
      .take(200);
    const priorIds = incoming
      .filter((e) => e.edgeType === 'next' || e.edgeType === 'prerequisite')
      .map((e) => e.fromConceptId);
    return await loadPublishedConcepts(ctx, priorIds);
  },
});

/** Next treatment = outgoing `next` (edges OUT of the concept). */
export const getNextTreatment = query({
  args: { conceptId: v.id('concepts') },
  handler: async (ctx, args) => {
    await requireReader(ctx);
    const outgoing = await ctx.db
      .query('conceptEdges')
      .withIndex('by_from', (q) => q.eq('fromConceptId', args.conceptId))
      .take(200);
    const nextIds = outgoing
      .filter((e) => e.edgeType === 'next')
      .map((e) => e.toConceptId);
    return await loadPublishedConcepts(ctx, nextIds);
  },
});

/** Related = both directions for related/application/revisits/extends/misconception_link. */
export const getRelatedConcepts = query({
  args: { conceptId: v.id('concepts') },
  handler: async (ctx, args) => {
    await requireReader(ctx);
    const outgoing = await ctx.db
      .query('conceptEdges')
      .withIndex('by_from', (q) => q.eq('fromConceptId', args.conceptId))
      .take(200);
    const incoming = await ctx.db
      .query('conceptEdges')
      .withIndex('by_to', (q) => q.eq('toConceptId', args.conceptId))
      .take(200);
    const ids: Id<'concepts'>[] = [];
    for (const e of outgoing) if (RELATED_EDGE_TYPES.has(e.edgeType)) ids.push(e.toConceptId);
    for (const e of incoming) if (RELATED_EDGE_TYPES.has(e.edgeType)) ids.push(e.fromConceptId);
    return await loadPublishedConcepts(ctx, ids);
  },
});

/**
 * The linear learning thread around a concept: walk backward via incoming `next`
 * edges and forward via outgoing `next` edges. Bounded to MAX_THREAD_HOPS each
 * way with a visited set to prevent runaway traversal / cycles.
 */
export const getConceptThread = query({
  args: { conceptId: v.id('concepts') },
  handler: async (ctx, args) => {
    await requireReader(ctx);
    const start = await ctx.db.get(args.conceptId);
    if (!start || start.status !== PUBLISHED) return [];

    const visited = new Set<string>([start._id]);

    const before: Doc<'concepts'>[] = [];
    let cursor: Id<'concepts'> = start._id;
    for (let i = 0; i < MAX_THREAD_HOPS; i++) {
      const incoming = await ctx.db
        .query('conceptEdges')
        .withIndex('by_to', (q) => q.eq('toConceptId', cursor))
        .take(50);
      const edge = incoming.find((e) => e.edgeType === 'next' && !visited.has(e.fromConceptId));
      if (!edge) break;
      const prev = await ctx.db.get(edge.fromConceptId);
      if (!prev || prev.status !== PUBLISHED) break;
      visited.add(prev._id);
      before.unshift(prev);
      cursor = prev._id;
    }

    const after: Doc<'concepts'>[] = [];
    cursor = start._id;
    for (let i = 0; i < MAX_THREAD_HOPS; i++) {
      const outgoing = await ctx.db
        .query('conceptEdges')
        .withIndex('by_from', (q) => q.eq('fromConceptId', cursor))
        .take(50);
      const edge = outgoing.find((e) => e.edgeType === 'next' && !visited.has(e.toConceptId));
      if (!edge) break;
      const nxt = await ctx.db.get(edge.toConceptId);
      if (!nxt || nxt.status !== PUBLISHED) break;
      visited.add(nxt._id);
      after.push(nxt);
      cursor = nxt._id;
    }

    return [...before, start, ...after];
  },
});

/**
 * Full-text concept search over the denormalised `searchText`. Normal users are
 * always restricted to published concepts; only platform admins may request a
 * different status. Optionally filtered by subject.
 */
export const searchConcepts = query({
  args: {
    query: v.string(),
    subjectId: v.optional(v.id('subjects')),
    status: v.optional(conceptStatus),
  },
  handler: async (ctx, args) => {
    const { profile } = await requireMembership(ctx);
    const isAdmin = profile.is_platform_admin === true;
    const status = isAdmin ? args.status ?? PUBLISHED : PUBLISHED;
    const term = args.query.trim();
    if (!term) return [];
    return await ctx.db
      .query('concepts')
      .withSearchIndex('search_text', (q) => {
        const base = q.search('searchText', term).eq('status', status);
        return args.subjectId ? base.eq('subjectId', args.subjectId) : base;
      })
      .take(20);
  },
});

/**
 * Generation seam: the rich, denormalised context for a concept (names not ids),
 * plus prior/next/related concept titles. The caller selects abilityLevel +
 * resourceType at generation time — they are NOT concept fields.
 */
export const getGenerationContext = query({
  args: { conceptId: v.id('concepts') },
  handler: async (ctx, args) => {
    await requireReader(ctx);
    const concept = await ctx.db.get(args.conceptId);
    if (!concept || concept.status !== PUBLISHED) return null;

    const [subject, yearStage, topic] = await Promise.all([
      ctx.db.get(concept.subjectId),
      ctx.db.get(concept.yearStageId),
      ctx.db.get(concept.topicId),
    ]);

    const incoming = await ctx.db
      .query('conceptEdges')
      .withIndex('by_to', (q) => q.eq('toConceptId', concept._id))
      .take(200);
    const outgoing = await ctx.db
      .query('conceptEdges')
      .withIndex('by_from', (q) => q.eq('fromConceptId', concept._id))
      .take(200);

    const priorIds = incoming
      .filter((e) => e.edgeType === 'next' || e.edgeType === 'prerequisite')
      .map((e) => e.fromConceptId);
    const nextIds = outgoing
      .filter((e) => e.edgeType === 'next')
      .map((e) => e.toConceptId);
    const relatedIds: Id<'concepts'>[] = [
      ...outgoing.filter((e) => RELATED_EDGE_TYPES.has(e.edgeType)).map((e) => e.toConceptId),
      ...incoming.filter((e) => RELATED_EDGE_TYPES.has(e.edgeType)).map((e) => e.fromConceptId),
    ];

    const [prior, next, related] = await Promise.all([
      loadPublishedConcepts(ctx, priorIds),
      loadPublishedConcepts(ctx, nextIds),
      loadPublishedConcepts(ctx, relatedIds),
    ]);

    return {
      conceptId: concept._id,
      conceptTitle: concept.title,
      subjectName: subject?.name ?? '',
      yearStageName: yearStage?.name ?? '',
      topicTitle: topic?.title ?? '',
      shortDescription: concept.shortDescription,
      detailedExplanation: concept.detailedExplanation,
      priorLearningSummary: concept.priorLearningSummary,
      nextLearningSummary: concept.nextLearningSummary,
      priorConcepts: prior.map((c) => c.title),
      nextConcepts: next.map((c) => c.title),
      relatedConcepts: related.map((c) => c.title),
      commonMisconceptions: concept.commonMisconceptions,
      keyVocabulary: concept.keyVocabulary,
      lessonGuidance: concept.lessonGuidance,
      assessmentGuidance: concept.assessmentGuidance,
      practicalLinks: concept.practicalLinks,
    };
  },
});
