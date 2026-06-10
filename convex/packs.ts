import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import type { QueryCtx } from './_generated/server';

/** True if the given Clerk user has the 'owner' (admin) role. */
async function isOwnerRole(ctx: QueryCtx, clerkId: string): Promise<boolean> {
  const profile = await ctx.db
    .query('profiles')
    .withIndex('by_clerk_id', (q) => q.eq('clerk_id', clerkId))
    .unique();
  return profile?.role === 'owner';
}

/**
 * Saves a freshly generated pack for the current user and returns its id.
 * `user_id` is the Clerk subject — the same access model the old RLS used
 * (`auth.uid() = user_id`).
 */
export const create = mutation({
  args: {
    topic: v.string(),
    subject: v.string(),
    exam_board: v.string(),
    course_level: v.string(),
    ability_level: v.string(),
    lesson_length: v.optional(v.string()),
    learning_objectives: v.optional(v.string()),
    teacher_notes_input: v.optional(v.string()),
    content: v.any(),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated.');
    return await ctx.db.insert('packs', {
      user_id: identity.subject,
      ...args,
      generation_status: 'complete',
      review_status: 'draft',
      updated_at: new Date().toISOString(),
    });
  },
});

/**
 * The current user's packs, newest first (≤20). Returns only the lightweight
 * columns the dashboard/history lists need — not the full `content` blob.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const docs = await ctx.db
      .query('packs')
      .withIndex('by_user', (q) => q.eq('user_id', identity.subject))
      .order('desc')
      .take(20);
    return docs.map((d) => ({
      _id: d._id,
      _creationTime: d._creationTime,
      topic: d.topic,
      subject: d.subject,
      exam_board: d.exam_board,
      course_level: d.course_level,
      ability_level: d.ability_level,
      generation_status: d.generation_status,
      review_status: d.review_status,
    }));
  },
});

/**
 * One pack by id. Scoped like the old RLS: the pack's owner, or an owner/admin,
 * otherwise null (also null for unknown ids).
 */
export const get = query({
  args: { id: v.id('packs') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const pack = await ctx.db.get(args.id);
    if (!pack) return null;
    if (
      pack.user_id !== identity.subject &&
      !(await isOwnerRole(ctx, identity.subject))
    ) {
      return null;
    }
    return pack;
  },
});
