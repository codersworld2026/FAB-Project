/**
 * Pure authorisation decisions.
 *
 * Framework-free and synchronous so it can be unit-tested against typed mock
 * profiles with no server runtime. The server-coupled wrappers live in ./policy.
 *
 * Roles: only 'teacher' and 'owner' are persisted today. 'department_lead' is a
 * forward-looking, type-only role (see domain/roles) and authorises NOTHING.
 */

import type { Role } from '../domain/roles';

/** Actions guarded by the policy layer. Extend as features land. */
export type Action =
  | 'resource:create'
  | 'resource:read:any'
  | 'admin:access'
  | 'prompts:write'
  | 'settings:write';

/**
 * Whether `actor` may perform `action`. Owners may do everything; teachers may
 * create their own resources; all other actions are owner-only. department_lead
 * grants nothing until the DB/RLS support it.
 */
export function can(actor: { role: Role }, action: Action): boolean {
  if (actor.role === 'owner') return true;
  if (actor.role === 'teacher') return action === 'resource:create';
  return false; // department_lead and any future unmapped role: deny by default
}
