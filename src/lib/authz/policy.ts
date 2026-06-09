/**
 * Server-side authorisation policy.
 *
 * WRAPS the existing guards in `src/lib/auth.ts` (`requireProfile`,
 * `requireOwner`) rather than replacing them — those remain the entry points used
 * by layouts and server actions. Row Level Security in Postgres remains the real
 * enforcement boundary; this layer expresses intent and adds defence in depth.
 *
 * This module is server-only (it imports the server guards). The pure decision
 * function lives in ./can so it can be unit-tested without the server runtime.
 */

import type { Profile } from '../types';
import { requireProfile, requireOwner } from '../auth';
import { can, type Action } from './can';

export { can } from './can';
export type { Action } from './can';
export { requireProfile, requireOwner };

/**
 * Require an authenticated profile that satisfies `action`. Uses the existing
 * redirect semantics: unauthenticated → /login; not permitted → the owner guard
 * (which redirects non-owners to /dashboard).
 */
export async function requireCan(action: Action): Promise<Profile> {
  const profile = await requireProfile();
  if (can(profile, action)) return profile;
  return requireOwner();
}
