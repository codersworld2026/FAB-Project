import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireMembership } from './authz';
import { resourceType, abilityLevel, resourceStatus } from './schema';

// Tenant-scoped, concept-anchored resources. Every function resolves the active
// organisation through `requireMembership`: an omitted organizationId uses the
// caller's default org; a supplied one is membership-checked (never trusted).
// Reads are filtered by the resolved org; writes are stamped with it + createdBy.

/** Resources for a concept within the caller's active/selected organisation. */
export const getResourcesForConcept = query({
  args: {
    conceptId: v.id('concepts'),
    organizationId: v.optional(v.id('organizations')),
  },
  handler: async (ctx, args) => {
    const { organizationId } = await requireMembership(ctx, args.organizationId);
    return await ctx.db
      .query('resources')
      .withIndex('by_org_concept', (q) =>
        q.eq('organizationId', organizationId).eq('conceptId', args.conceptId),
      )
      .order('desc')
      .take(100);
  },
});

/**
 * Saves a generated resource against a concept. The concept must exist and be
 * published; its subject/topic/year-stage are denormalised onto the resource so
 * org-scoped reads stay single-index. Stamped with the resolved organizationId +
 * createdBy and carries generation provenance for cost/audit.
 */
export const create = mutation({
  args: {
    conceptId: v.id('concepts'),
    resourceType: resourceType,
    abilityLevel: abilityLevel,
    title: v.string(),
    summary: v.string(),
    content: v.any(),
    teacherNotes: v.optional(v.string()),
    status: v.optional(resourceStatus),
    model: v.optional(v.string()),
    promptVersion: v.optional(v.string()),
    tokensInput: v.optional(v.number()),
    tokensOutput: v.optional(v.number()),
    costEstimate: v.optional(v.number()),
    generationContextSnapshot: v.optional(v.any()),
    organizationId: v.optional(v.id('organizations')),
  },
  handler: async (ctx, args) => {
    const { organizationId, userId } = await requireMembership(ctx, args.organizationId);

    const concept = await ctx.db.get(args.conceptId);
    if (!concept || concept.status !== 'published') {
      throw new Error('Concept not found or not published.');
    }

    const now = new Date().toISOString();
    return await ctx.db.insert('resources', {
      organizationId,
      createdBy: userId,
      conceptId: concept._id,
      topicId: concept.topicId,
      subjectId: concept.subjectId,
      yearStageId: concept.yearStageId,
      resourceType: args.resourceType,
      title: args.title,
      summary: args.summary,
      content: args.content,
      teacherNotes: args.teacherNotes,
      abilityLevel: args.abilityLevel,
      status: args.status ?? 'draft',
      model: args.model,
      promptVersion: args.promptVersion,
      tokensInput: args.tokensInput,
      tokensOutput: args.tokensOutput,
      costEstimate: args.costEstimate,
      generationContextSnapshot: args.generationContextSnapshot,
      createdAt: now,
      updatedAt: now,
    });
  },
});
