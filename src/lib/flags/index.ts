/**
 * Feature flags — typed, environment-driven, DEFAULT DISABLED.
 *
 * Phase 0 keeps flags deliberately simple: they read `process.env` at call time
 * with a safe `false` default. We do NOT use the `app_settings` table here — that
 * would add an async DB round-trip (runtime coupling) to every flag check. Flags
 * can migrate to an admin-controlled store later without a schema change.
 *
 * Nothing in Phase 0 wires these into the UI; they exist so the year-by-year
 * rollout across Biology / Chemistry / Physics can be gated when content lands.
 */

import type { SubjectId } from '../domain/subjects';
import type { YearLevelId } from '../domain/years';

/** A flag is enabled only when its env var is exactly "true" or "1". */
function envFlag(name: string): boolean {
  const v = process.env[name];
  return v === 'true' || v === '1';
}

/** Static (non-rollout) flags. All default false. */
export const FLAGS = {
  /** Master switch for the multi-subject experience (off until rollout begins). */
  multiSubjectEnabled: (): boolean => envFlag('FAB_FLAG_MULTI_SUBJECT'),
} as const;

/**
 * Whether a given (subject, year) pair has been rolled out. Convention:
 *   FAB_ROLLOUT_<SUBJECT>_<YEAR>=true
 * e.g. `FAB_ROLLOUT_BIOLOGY_YEAR_7=true`. Defaults to false (disabled).
 */
export function isRolledOut(subject: SubjectId, year: YearLevelId): boolean {
  return envFlag(`FAB_ROLLOUT_${subject.toUpperCase()}_${year.toUpperCase()}`);
}
