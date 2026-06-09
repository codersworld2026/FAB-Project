/**
 * Domain layer — the single source of truth for cross-cutting identifiers used
 * across the platform: subjects, year levels, qualification stages, exam boards
 * and roles.
 *
 * The four curriculum dimensions (subject, year level, qualification stage, exam
 * board) are deliberately ORTHOGONAL and must never be conflated. Stable
 * lowercase IDs are stored/linked; display labels live in separate maps; adapters
 * translate the existing free-text (title-case) data with no migration.
 *
 * Phase 0 introduces the TYPES only — no curriculum content lives here. All three
 * sciences (Biology, Chemistry, Physics) and all seven years (7–13) are
 * representable from day one to support the year-by-year rollout.
 */

export * from './subjects';
export * from './years';
export * from './qualification-stages';
export * from './exam-boards';
export * from './roles';
