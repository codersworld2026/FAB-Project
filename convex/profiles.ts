import { mutation, query } from './_generated/server';

/** The current authenticated user's profile, or null if none exists yet. */
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query('profiles')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
      .unique();
  },
});

/**
 * Idempotently creates the current user's profile from their Clerk identity.
 * Replaces the old Postgres `handle_new_user` signup trigger. Called on first
 * sign-in; a Clerk webhook can take over keeping email/role in sync later.
 */
export const ensureProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated.');

    const existing = await ctx.db
      .query('profiles')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
      .unique();
    if (existing) return existing;

    const doc: {
      clerk_id: string;
      email: string;
      role: 'teacher';
      updated_at: string;
      full_name?: string;
    } = {
      clerk_id: identity.subject,
      email: identity.email ?? '',
      role: 'teacher',
      updated_at: new Date().toISOString(),
    };
    if (identity.name) doc.full_name = identity.name;

    const id = await ctx.db.insert('profiles', doc);
    return await ctx.db.get(id);
  },
});
