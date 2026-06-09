/**
 * Canonical EXAM-BOARD domain model.
 *
 * A SEPARATE concept from subject, year level and qualification stage. OPTIONAL:
 * KS3 study has no exam board (null is valid and expected). Stable IDs; display
 * labels in a separate map.
 *
 * The legacy free-text `exam_board` column is overloaded in current data — it
 * holds either a board ("Pearson Edexcel") or a qualification label
 * ("Edexcel GCSE Biology"). The adapter below tolerates both without a migration.
 */

export const EXAM_BOARD_IDS = ['edexcel', 'aqa', 'ocr'] as const;
export type ExamBoardId = (typeof EXAM_BOARD_IDS)[number];

export const EXAM_BOARD_LABELS: Record<ExamBoardId, string> = {
  edexcel: 'Pearson Edexcel',
  aqa: 'AQA',
  ocr: 'OCR',
};

export function isExamBoardId(value: unknown): value is ExamBoardId {
  return (
    typeof value === 'string' && (EXAM_BOARD_IDS as readonly string[]).includes(value)
  );
}

export function examBoardLabel(id: ExamBoardId): string {
  return EXAM_BOARD_LABELS[id];
}

/**
 * Best-effort map of a legacy/free-text exam-board OR qualification-label value
 * onto a stable ExamBoardId. Handles "Pearson Edexcel", "Edexcel",
 * "Edexcel GCSE Biology", etc. Returns null when no board can be identified
 * (e.g. KS3 resources, which legitimately have no exam board).
 */
export function examBoardIdFromLegacy(
  value: string | null | undefined,
): ExamBoardId | null {
  if (!value) return null;
  const v = value.toLowerCase();
  if (v.includes('edexcel') || v.includes('pearson')) return 'edexcel';
  if (v.includes('aqa')) return 'aqa';
  if (v.includes('ocr')) return 'ocr';
  return null;
}
