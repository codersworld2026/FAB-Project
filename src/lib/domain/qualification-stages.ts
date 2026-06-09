/**
 * Canonical QUALIFICATION-STAGE domain model.
 *
 * The stage/route a year of study sits in. SEPARATE from year level and exam
 * board: KS3 (Years 7–9) typically has no exam board, while Years 10–13 map onto
 * GCSE / International GCSE / A-level, which may use different boards.
 *
 * Stable IDs; display labels in a separate map. Extensible — only add verified
 * stages.
 */

export const QUALIFICATION_STAGE_IDS = ['ks3', 'gcse', 'igcse', 'a_level'] as const;
export type QualificationStageId = (typeof QUALIFICATION_STAGE_IDS)[number];

export const QUALIFICATION_STAGE_LABELS: Record<QualificationStageId, string> = {
  ks3: 'Key Stage 3',
  gcse: 'GCSE',
  igcse: 'International GCSE',
  a_level: 'A-level',
};

/** Whether a stage requires an exam board. KS3 does not. */
export const STAGE_REQUIRES_EXAM_BOARD: Record<QualificationStageId, boolean> = {
  ks3: false,
  gcse: true,
  igcse: true,
  a_level: true,
};

export function isQualificationStageId(
  value: unknown,
): value is QualificationStageId {
  return (
    typeof value === 'string' &&
    (QUALIFICATION_STAGE_IDS as readonly string[]).includes(value)
  );
}

export function qualificationStageLabel(id: QualificationStageId): string {
  return QUALIFICATION_STAGE_LABELS[id];
}

export function stageRequiresExamBoard(id: QualificationStageId): boolean {
  return STAGE_REQUIRES_EXAM_BOARD[id];
}

/**
 * Map a legacy/free-text course-level value ("GCSE", "International GCSE") onto a
 * stable QualificationStageId. Returns null if unknown.
 */
export function qualificationStageIdFromLegacy(
  value: string | null | undefined,
): QualificationStageId | null {
  if (!value) return null;
  const v = value.trim().toLowerCase();
  if (v === 'gcse') return 'gcse';
  if (v === 'international gcse' || v === 'igcse') return 'igcse';
  if (v === 'a-level' || v === 'a level' || v === 'a_level') return 'a_level';
  if (v === 'ks3' || v === 'key stage 3') return 'ks3';
  return null;
}
