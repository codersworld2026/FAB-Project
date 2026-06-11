import type { QueryCtx } from './_generated/server';
import type { Doc, Id } from './_generated/dataModel';

// Shared authorization + active-organisation guards. Every org-scoped Convex
// function should resolve identity → profile → membership through these helpers
// BEFORE reading or writing. There is no RLS — authorization lives in code.
//
// Identity model: `identity.subject` is the Clerk user id, stored as
// `profiles.clerk_id` and `memberships.userId`. We never accept a userId/orgId
// as a trusted authorization input — the signed-in identity is always derived
// server-side, and any client-supplied organizationId is membership-checked.

/** A resolved membership context: the profile, its Clerk id, the active org, and the row. */
export interface MembershipContext {
  profile: Doc<'profiles'>;
  userId: string;
  organizationId: Id<'organizations'>;
  membership: Doc<'memberships'>;
}

/**
 * Resolves the signed-in user's profile. Throws if unauthenticated or if no
 * profile row exists yet (the app calls `profiles.ensureProfile` on first
 * sign-in, which also bootstraps a personal org + membership).
 */
export async function requireProfile(ctx: QueryCtx): Promise<Doc<'profiles'>> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error('Not authenticated.');
  const profile = await ctx.db
    .query('profiles')
    .withIndex('by_clerk_id', (q) => q.eq('clerk_id', identity.subject))
    .unique();
  if (!profile) throw new Error('No profile found for the current user.');
  return profile;
}

/**
 * Asserts the signed-in user is a platform admin. `is_platform_admin === true`
 * is the ONLY thing that grants curriculum-write access — being the owner of a
 * (personal) organisation does NOT.
 */
export async function requirePlatformAdmin(ctx: QueryCtx): Promise<Doc<'profiles'>> {
  const profile = await requireProfile(ctx);
  if (profile.is_platform_admin !== true) {
    throw new Error('Platform admin access required.');
  }
  return profile;
}

/** Looks up a specific (userId, organizationId) membership, or null. */
async function getMembership(
  ctx: QueryCtx,
  userId: string,
  organizationId: Id<'organizations'>,
): Promise<Doc<'memberships'> | null> {
  // A user's memberships are bounded (no org-switcher / bulk membership yet),
  // so scanning the user's own memberships is cheap and index-backed.
  const memberships = await ctx.db
    .query('memberships')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .take(100);
  return memberships.find((m) => m.organizationId === organizationId) ?? null;
}

/**
 * Resolves the active organisation for a user when none is supplied: the
 * membership flagged `isDefault === true`, else the earliest membership by
 * creation order, else throws (the user has no membership).
 */
export async function getDefaultOrganizationForUser(
  ctx: QueryCtx,
  userId: string,
): Promise<Id<'organizations'>> {
  const defaultMembership = await ctx.db
    .query('memberships')
    .withIndex('by_user_default', (q) => q.eq('userId', userId).eq('isDefault', true))
    .first();
  if (defaultMembership) return defaultMembership.organizationId;

  // Fallback: the earliest membership the user holds. The `by_user` index is
  // ordered by creation time, and createdAt is stamped at insert, so the first
  // row is the earliest by createdAt.
  const earliest = await ctx.db
    .query('memberships')
    .withIndex('by_user', (q) => q.eq('userId', userId))
    .first();
  if (!earliest) throw new Error('User has no organisation membership.');
  return earliest.organizationId;
}

/**
 * Throws unless the user holds a membership in the given organisation. Use this
 * to validate ANY client-supplied organizationId before a read/write — a
 * client-provided id is never trusted without this check.
 */
export async function assertCanAccessOrganization(
  ctx: QueryCtx,
  userId: string,
  organizationId: Id<'organizations'>,
): Promise<Doc<'memberships'>> {
  const membership = await getMembership(ctx, userId, organizationId);
  if (!membership) {
    throw new Error('Not a member of the requested organisation.');
  }
  return membership;
}

/**
 * The core org-scoped guard. Resolves the signed-in profile, then:
 *  - if `organizationId` is supplied, verifies membership in it (never trusted);
 *  - otherwise resolves the user's default/active organisation.
 * Returns the full membership context for stamping/filtering downstream.
 */
export async function requireMembership(
  ctx: QueryCtx,
  organizationId?: Id<'organizations'>,
): Promise<MembershipContext> {
  const profile = await requireProfile(ctx);
  const userId = profile.clerk_id;

  if (organizationId) {
    const membership = await assertCanAccessOrganization(ctx, userId, organizationId);
    return { profile, userId, organizationId, membership };
  }

  const resolvedOrgId = await getDefaultOrganizationForUser(ctx, userId);
  const membership = await getMembership(ctx, userId, resolvedOrgId);
  if (!membership) {
    // getDefaultOrganizationForUser only returns an org the user belongs to.
    throw new Error('Membership lookup failed for the default organisation.');
  }
  return { profile, userId, organizationId: resolvedOrgId, membership };
}
