/**
 * Canonical YEAR-LEVEL domain model (Year 7–13).
 *
 * Stable IDs ('year_7'…'year_13'); display labels in a separate map; numeric +
 * key-stage helpers; an adapter from legacy free-text ("Year 10") with no data
 * migration.
 *
 * Year level is a SEPARATE concept from qualification stage and exam board (see
 * ./qualification-stages and ./exam-boards) — never conflate them. KS3 years in
 * particular usually have no exam board.
 */

export const YEAR_LEVEL_IDS = [
  'year_7',
  'year_8',
  'year_9',
  'year_10',
  'year_11',
  'year_12',
  'year_13',
] as const;
export type YearLevelId = (typeof YEAR_LEVEL_IDS)[number];

export const YEAR_LABELS: Record<YearLevelId, string> = {
  year_7: 'Year 7',
  year_8: 'Year 8',
  year_9: 'Year 9',
  year_10: 'Year 10',
  year_11: 'Year 11',
  year_12: 'Year 12',
  year_13: 'Year 13',
};

export type KeyStage = 'KS3' | 'KS4' | 'KS5';

export function isYearLevelId(value: unknown): value is YearLevelId {
  return (
    typeof value === 'string' &&
    (YEAR_LEVEL_IDS as readonly string[]).includes(value)
  );
}

export function yearLabel(id: YearLevelId): string {
  return YEAR_LABELS[id];
}

/** The numeric year (7–13) for a YearLevelId. */
export function yearNumber(id: YearLevelId): number {
  return Number(id.slice('year_'.length));
}

/** Key stage for a year level. KS3 = 7–9, KS4 = 10–11, KS5 = 12–13. */
export function keyStageOf(id: YearLevelId): KeyStage {
  const n = yearNumber(id);
  if (n <= 9) return 'KS3';
  if (n <= 11) return 'KS4';
  return 'KS5';
}

/**
 * Map a legacy/free-text year value ("Year 10", "year 10", "10", "Y10") onto a
 * stable YearLevelId. Returns null if it does not resolve to Year 7–13.
 */
export function yearLevelIdFromLegacy(
  value: string | null | undefined,
): YearLevelId | null {
  if (!value) return null;
  const digits = value.match(/\d+/)?.[0];
  if (!digits) return null;
  const candidate = `year_${digits}`;
  return isYearLevelId(candidate) ? candidate : null;
}
