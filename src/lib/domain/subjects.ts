/**
 * Canonical SUBJECT domain model.
 *
 * Stable internal IDs (lowercase, never displayed) are the source of truth for
 * storage and links. Human-facing labels live in a separate map. Existing data
 * stores title-case display values (e.g. "Biology") in the free-text `subject`
 * column — the adapter below translates without any data migration.
 *
 * All three sciences are supported from day one; curriculum content is added
 * later. Subject is a SEPARATE concept from year level, qualification stage and
 * exam board — never conflate them.
 */

export const SUBJECT_IDS = ['biology', 'chemistry', 'physics'] as const;
export type SubjectId = (typeof SUBJECT_IDS)[number];

export const SUBJECT_LABELS: Record<SubjectId, string> = {
  biology: 'Biology',
  chemistry: 'Chemistry',
  physics: 'Physics',
};

export function isSubjectId(value: unknown): value is SubjectId {
  return (
    typeof value === 'string' && (SUBJECT_IDS as readonly string[]).includes(value)
  );
}

export function subjectLabel(id: SubjectId): string {
  return SUBJECT_LABELS[id];
}

/**
 * Map a legacy/free-text subject value (e.g. "Biology", "biology", " BIOLOGY ")
 * onto a stable SubjectId. Returns null if it does not match a known subject.
 */
export function subjectIdFromLegacy(
  value: string | null | undefined,
): SubjectId | null {
  if (!value) return null;
  const normalised = value.trim().toLowerCase();
  return (SUBJECT_IDS as readonly string[]).includes(normalised)
    ? (normalised as SubjectId)
    : null;
}
