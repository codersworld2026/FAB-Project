import type { QualificationCurriculum, QualificationId } from './types';

/**
 * The two supported qualifications. Topic data is intentionally EMPTY — it must
 * be sourced from the verified Pearson Edexcel specifications and not invented.
 * Until then, the topic selector falls back to free-text entry (Phase 3).
 *
 * Edexcel GCSE Biology and International GCSE Biology are SEPARATE specs — keep
 * their data separate; never merge topics across the two.
 */

export const EDEXCEL_GCSE_BIOLOGY: QualificationCurriculum = {
  id: 'edexcel-gcse-biology',
  label: 'Edexcel GCSE Biology',
  // TODO: confirm specification code from the official Pearson document.
  specificationCode: null,
  subject: 'Biology',
  // TODO: populate from the verified Edexcel GCSE Biology specification.
  topics: [],
};

export const EDEXCEL_IGCSE_BIOLOGY: QualificationCurriculum = {
  id: 'edexcel-igcse-biology',
  label: 'Edexcel International GCSE Biology',
  // TODO: confirm specification code from the official Pearson document.
  specificationCode: null,
  subject: 'Biology',
  // TODO: populate from the verified Edexcel International GCSE Biology specification.
  topics: [],
};

export const CURRICULA: Record<QualificationId, QualificationCurriculum> = {
  'edexcel-gcse-biology': EDEXCEL_GCSE_BIOLOGY,
  'edexcel-igcse-biology': EDEXCEL_IGCSE_BIOLOGY,
};

export function getCurriculum(id: QualificationId): QualificationCurriculum {
  return CURRICULA[id] ?? EDEXCEL_GCSE_BIOLOGY;
}

/** Whether verified topic data exists yet (drives selector vs free-text input). */
export function hasTopicData(id: QualificationId): boolean {
  return getCurriculum(id).topics.length > 0;
}
