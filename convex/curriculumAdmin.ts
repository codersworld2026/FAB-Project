import { v } from 'convex/values';
import { mutation } from './_generated/server';
import type { MutationCtx } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { requirePlatformAdmin } from './authz';
import {
  yearStagePhase,
  difficultyLevel,
  abilityLevel,
  conceptEdgeType,
} from './schema';

// Platform-admin curriculum authoring. EVERY write requires
// `requirePlatformAdmin` (is_platform_admin === true) — org-owner does NOT grant
// it. The reusable upsert helpers below are also called by the idempotent seed.

type Phase = 'KS3' | 'KS4' | 'GCSE' | 'IGCSE';
type Difficulty = 'foundational' | 'developing' | 'secure' | 'stretch';
type Ability = 'support' | 'core' | 'challenge';
type ConceptStatusValue = 'draft' | 'published' | 'archived';
type EdgeType =
  | 'prerequisite'
  | 'next'
  | 'related'
  | 'misconception_link'
  | 'application'
  | 'revisits'
  | 'extends';

/** The editable content fields of a concept (everything except derived/audit fields). */
export interface ConceptContentInput {
  slug: string;
  title: string;
  subjectId: Id<'subjects'>;
  yearStageId: Id<'yearStages'>;
  topicId: Id<'topics'>;
  orderIndex: number;
  shortDescription: string;
  detailedExplanation: string;
  priorLearningSummary: string;
  nextLearningSummary: string;
  commonMisconceptions: string[];
  keyVocabulary: string[];
  lessonGuidance: string;
  assessmentGuidance: string;
  practicalLinks: string[];
  difficultyLevel: Difficulty;
  abilitySuitability: Ability[];
  scienceSkillsLinks: string[];
  examBoard?: string;
}

/** The denormalised search field — title + vocabulary + misconceptions. */
export function buildConceptSearchText(input: {
  title: string;
  keyVocabulary: string[];
  commonMisconceptions: string[];
}): string {
  return [input.title, ...input.keyVocabulary, ...input.commonMisconceptions].join(' ');
}

// --- Reusable upsert helpers (stable keys; idempotent) ----------------------

export async function upsertSubjectBySlug(
  ctx: MutationCtx,
  input: { slug: string; name: string },
): Promise<Id<'subjects'>> {
  const existing = await ctx.db
    .query('subjects')
    .withIndex('by_slug', (q) => q.eq('slug', input.slug))
    .unique();
  if (existing) {
    if (existing.name !== input.name) await ctx.db.patch(existing._id, { name: input.name });
    return existing._id;
  }
  return await ctx.db.insert('subjects', input);
}

export async function upsertYearStageBySlug(
  ctx: MutationCtx,
  input: { slug: string; name: string; phase: Phase; orderIndex: number },
): Promise<Id<'yearStages'>> {
  const existing = await ctx.db
    .query('yearStages')
    .withIndex('by_slug', (q) => q.eq('slug', input.slug))
    .unique();
  if (existing) {
    await ctx.db.patch(existing._id, {
      name: input.name,
      phase: input.phase,
      orderIndex: input.orderIndex,
    });
    return existing._id;
  }
  return await ctx.db.insert('yearStages', input);
}

export async function upsertTopicByKey(
  ctx: MutationCtx,
  input: {
    subjectId: Id<'subjects'>;
    yearStageId: Id<'yearStages'>;
    title: string;
    description: string;
    orderIndex: number;
    examBoard?: string;
  },
): Promise<Id<'topics'>> {
  // Stable key: (subjectId, yearStageId, title).
  const candidates = await ctx.db
    .query('topics')
    .withIndex('by_subject_stage_order', (q) =>
      q.eq('subjectId', input.subjectId).eq('yearStageId', input.yearStageId),
    )
    .take(500);
  const existing = candidates.find((t) => t.title === input.title);
  const fields = {
    subjectId: input.subjectId,
    yearStageId: input.yearStageId,
    title: input.title,
    description: input.description,
    orderIndex: input.orderIndex,
    ...(input.examBoard !== undefined ? { examBoard: input.examBoard } : {}),
  };
  if (existing) {
    await ctx.db.patch(existing._id, fields);
    return existing._id;
  }
  return await ctx.db.insert('topics', fields);
}

export async function upsertConceptBySlug(
  ctx: MutationCtx,
  input: ConceptContentInput & {
    status: ConceptStatusValue;
    lastEditedBy: string;
    publishedAt?: string;
  },
): Promise<Id<'concepts'>> {
  const now = new Date().toISOString();
  const searchText = buildConceptSearchText(input);
  const existing = await ctx.db
    .query('concepts')
    .withIndex('by_slug', (q) => q.eq('slug', input.slug))
    .unique();

  const base = {
    slug: input.slug,
    title: input.title,
    subjectId: input.subjectId,
    yearStageId: input.yearStageId,
    topicId: input.topicId,
    orderIndex: input.orderIndex,
    shortDescription: input.shortDescription,
    detailedExplanation: input.detailedExplanation,
    priorLearningSummary: input.priorLearningSummary,
    nextLearningSummary: input.nextLearningSummary,
    commonMisconceptions: input.commonMisconceptions,
    keyVocabulary: input.keyVocabulary,
    lessonGuidance: input.lessonGuidance,
    assessmentGuidance: input.assessmentGuidance,
    practicalLinks: input.practicalLinks,
    difficultyLevel: input.difficultyLevel,
    abilitySuitability: input.abilitySuitability,
    scienceSkillsLinks: input.scienceSkillsLinks,
    status: input.status,
    lastEditedBy: input.lastEditedBy,
    lastEditedAt: now,
    searchText,
    ...(input.examBoard !== undefined ? { examBoard: input.examBoard } : {}),
    ...(input.publishedAt !== undefined ? { publishedAt: input.publishedAt } : {}),
  };

  if (existing) {
    await ctx.db.patch(existing._id, { ...base, version: existing.version + 1 });
    return existing._id;
  }
  return await ctx.db.insert('concepts', { ...base, version: 1 });
}

export async function upsertEdgeByKey(
  ctx: MutationCtx,
  input: { fromConceptId: Id<'concepts'>; toConceptId: Id<'concepts'>; edgeType: EdgeType },
): Promise<Id<'conceptEdges'>> {
  // Stable key: (fromConceptId, toConceptId, edgeType).
  const candidates = await ctx.db
    .query('conceptEdges')
    .withIndex('by_from', (q) => q.eq('fromConceptId', input.fromConceptId))
    .take(500);
  const existing = candidates.find(
    (e) => e.toConceptId === input.toConceptId && e.edgeType === input.edgeType,
  );
  if (existing) return existing._id;
  return await ctx.db.insert('conceptEdges', input);
}

// --- Registered platform-admin mutations ------------------------------------

export const createSubject = mutation({
  args: { slug: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx);
    return await upsertSubjectBySlug(ctx, args);
  },
});

export const createYearStage = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    phase: yearStagePhase,
    orderIndex: v.number(),
  },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx);
    return await upsertYearStageBySlug(ctx, args);
  },
});

export const createTopic = mutation({
  args: {
    subjectId: v.id('subjects'),
    yearStageId: v.id('yearStages'),
    title: v.string(),
    description: v.string(),
    orderIndex: v.number(),
    examBoard: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx);
    return await upsertTopicByKey(ctx, args);
  },
});

export const createConcept = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    subjectId: v.id('subjects'),
    yearStageId: v.id('yearStages'),
    topicId: v.id('topics'),
    orderIndex: v.number(),
    shortDescription: v.string(),
    detailedExplanation: v.string(),
    priorLearningSummary: v.string(),
    nextLearningSummary: v.string(),
    commonMisconceptions: v.array(v.string()),
    keyVocabulary: v.array(v.string()),
    lessonGuidance: v.string(),
    assessmentGuidance: v.string(),
    practicalLinks: v.array(v.string()),
    difficultyLevel: difficultyLevel,
    abilitySuitability: v.array(abilityLevel),
    scienceSkillsLinks: v.array(v.string()),
    examBoard: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx);
    // New concepts start as drafts; publishConcept flips them live.
    return await upsertConceptBySlug(ctx, {
      ...args,
      status: 'draft',
      lastEditedBy: admin.clerk_id,
    });
  },
});

export const createEdge = mutation({
  args: {
    fromConceptId: v.id('concepts'),
    toConceptId: v.id('concepts'),
    edgeType: conceptEdgeType,
  },
  handler: async (ctx, args) => {
    await requirePlatformAdmin(ctx);
    return await upsertEdgeByKey(ctx, args);
  },
});

export const publishConcept = mutation({
  args: { conceptId: v.id('concepts') },
  handler: async (ctx, args) => {
    const admin = await requirePlatformAdmin(ctx);
    const concept = await ctx.db.get(args.conceptId);
    if (!concept) throw new Error('Concept not found.');
    const now = new Date().toISOString();
    await ctx.db.patch(args.conceptId, {
      status: 'published',
      publishedAt: concept.publishedAt ?? now,
      lastEditedBy: admin.clerk_id,
      lastEditedAt: now,
      version: concept.version + 1,
    });
    return null;
  },
});
