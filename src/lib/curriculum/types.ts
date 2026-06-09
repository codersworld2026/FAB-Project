/**
 * Curriculum data model for the supported Edexcel Biology qualifications.
 *
 * IMPORTANT: topic/subtopic content must come from the VERIFIED Pearson Edexcel
 * specifications. Do NOT fabricate spec references, objectives or practicals.
 * The two qualifications below ship with empty `topics` arrays and clear TODOs
 * until verified data is supplied; the typed shape lets the topic selector and
 * AI prompt builder consume it without further refactoring.
 */

export type QualificationId = 'edexcel-gcse-biology' | 'edexcel-igcse-biology';

export interface Subtopic {
  /** Spec reference (e.g. "1.1"). TODO: populate from the verified spec. */
  code: string;
  title: string;
  learningObjectives: string[];
  keyVocabulary: string[];
  requiredPracticals?: string[];
  assessmentObjectives?: string[];
  examCommandWords?: string[];
}

export interface Topic {
  /** Spec topic number/letter. TODO: populate from the verified spec. */
  code: string;
  title: string;
  subtopics: Subtopic[];
}

export interface QualificationCurriculum {
  id: QualificationId;
  label: string;
  /** Pearson specification code. TODO: confirm against the official document. */
  specificationCode: string | null;
  subject: 'Biology';
  /** TODO: populate from the verified Edexcel specification (kept empty for now). */
  topics: Topic[];
}
