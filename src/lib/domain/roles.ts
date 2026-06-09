/**
 * Canonical ROLE domain model.
 *
 * `UserRole` ('teacher' | 'owner') is the PERSISTED role and must stay in
 * lock-step with the Postgres `user_role` enum (migration 0001). It is re-used
 * here unchanged from `src/lib/types.ts`.
 *
 * `Role` additionally includes 'department_lead' for FORWARD-LOOKING policy
 * design only.
 *
 * IMPORTANT: `department_lead` is NOT a persisted role, NOT assignable, and NOT
 * authorisable in production. No profile can hold it until a later phase adds the
 * DB enum value and the supporting Row Level Security. Until then it exists
 * purely at the type level so policy code can be written and tested against typed
 * mock profiles. It must never be treated as granting access.
 */

import type { UserRole } from '../types';

export type { UserRole };

/** Forward-looking role set. `department_lead` is type-only (see file header). */
export type Role = UserRole | 'department_lead';

/** Roles that can actually be stored on a profile today. */
export const PERSISTED_ROLES: readonly UserRole[] = ['teacher', 'owner'];

/** Whether a value is a role that can currently be persisted on a profile. */
export function isPersistedRole(value: unknown): value is UserRole {
  return value === 'teacher' || value === 'owner';
}
