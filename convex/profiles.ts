import { mutation, query } from './_generated/server';
import type { MutationCtx } from './_generated/server';
import type { Doc } from './_generated/dataModel';

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
 * Bootstraps a personal organisation + owner membership for a profile, if it
 * has none yet. Idempotent: if the user already holds any membership it does
 * nothing — so re-running (and backfilling profiles created before orgs
 * existed) never duplicates an org or membership.
 */
async function ensurePersonalOrg(ctx: MutationCtx, profile: Doc<'profiles'>): Promise<void> {
  const existing = await ctx.db
    .query('memberships')
    .withIndex('by_user', (q) => q.eq('userId', profile.clerk_id))
    .first();
  if (existing) return;

  const now = new Date().toISOString();
  const orgName = profile.full_name
    ? `${profile.full_name}'s workspace`
    : profile.email || 'Personal workspace';

  const organizationId = await ctx.db.insert('organizations', {
    name: orgName,
    type: 'individual',
    createdAt: now,
  });
  await ctx.db.insert('memberships', {
    userId: profile.clerk_id,
    organizationId,
    role: 'owner',
    createdAt: now,
    isDefault: true,
  });
}

/**
 * Idempotently creates the current user's profile from their Clerk identity and
 * bootstraps their personal organisation + owner membership. Replaces the old
 * Postgres `handle_new_user` signup trigger. Called on first sign-in; a Clerk
 * webhook can take over keeping email/role in sync later.
 */
export const ensureProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error('Not authenticated.');

    let profile = await ctx.db
      .query('profiles')
      .withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
      .unique();

    if (profile) {
      // Backfill email/name from the Clerk identity if they've changed (keeps
      // the profile in sync until a Clerk→Convex webhook takes over).
      const patch: { email?: string; full_name?: string; updated_at?: string } = {};
      const email = identity.email ?? '';
      if (email && email !== profile.email) patch.email = email;
      if (identity.name && identity.name !== profile.full_name) {
        patch.full_name = identity.name;
      }
      if (Object.keys(patch).length > 0) {
        patch.updated_at = new Date().toISOString();
        await ctx.db.patch(profile._id, patch);
        profile = await ctx.db.get(profile._id);
      }
    } else {
      const doc: {
        clerk_id: string;
        email: string;
        role: 'teacher';
        is_platform_admin: boolean;
        updated_at: string;
        full_name?: string;
      } = {
        clerk_id: identity.subject,
        email: identity.email ?? '',
        role: 'teacher',
        is_platform_admin: false,
        updated_at: new Date().toISOString(),
      };
      if (identity.name) doc.full_name = identity.name;

      const id = await ctx.db.insert('profiles', doc);
      profile = await ctx.db.get(id);
    }

    if (!profile) throw new Error('Failed to load profile after upsert.');
    // Bootstrap (or backfill) the user's personal org + owner membership.
    await ensurePersonalOrg(ctx, profile);
    return profile;
  },
});
