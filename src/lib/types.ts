import type { GenerationStatus, ReviewStatus } from './config';

export type UserRole = 'teacher' | 'owner';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  school: string | null;
  role: UserRole;
  /** Platform-admin flag — the only thing granting curriculum-write access. */
  isPlatformAdmin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Pack {
  id: string;
  user_id: string;
  topic: string;
  subject: string;
  exam_board: string;
  course_level: string;
  ability_level: string;
  lesson_length: string | null;
  learning_objectives: string | null;
  teacher_notes_input: string | null;
  content: PackContent | null;
  model: string | null;
  generation_status: GenerationStatus;
  generation_error: string | null;
  review_status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

export type WorksheetLevel = 'Foundation' | 'Standard' | 'Mastery';

export interface LessonPlanSection {
  title: string;
  durationMins?: number;
  detail: string;
}

export interface Slide {
  title: string;
  bullets: string[];
  teacherNotes?: string;
}

export interface WorksheetQuestion {
  prompt: string;
  marks?: number;
}

export interface Worksheet {
  level: WorksheetLevel;
  title: string;
  intro?: string;
  questions: WorksheetQuestion[];
  answers: string[];
}

export interface AssessmentQuestion {
  prompt: string;
  marks: number;
}

export interface MarkSchemeItem {
  questionRef: string;
  answer: string;
  marks: number;
}

/**
 * Structured generated content — the SOURCE OF TRUTH for a pack. The PDF and
 * PowerPoint exports (M5) are rendered from this shape. Produced by the
 * generator (mock now, Anthropic later).
 */
export interface PackContent {
  overview: {
    summary: string;
    objectives: string[];
  };
  lessonPlan: {
    sections: LessonPlanSection[];
  };
  slides: Slide[];
  worksheets: Worksheet[]; // exactly three: Foundation, Standard, Mastery
  assessment: {
    questions: AssessmentQuestion[];
  };
  markScheme: MarkSchemeItem[];
  teacherNotes: {
    misconceptions: string[];
    teachingPoints: string[];
    safety?: string;
  };
}

/* --------------------------- Activity sheets --------------------------- */

export interface ActivityItem {
  /** The student-facing task/question. */
  prompt: string;
  /** The teacher answer (shown only on the teacher version). */
  answer: string;
  marks?: number;
}

/** Structured activity-sheet content — source of truth for the print view. */
export interface ActivitySheetContent {
  /** Student-facing instructions. */
  intro: string;
  estimatedMinutes: number;
  items: ActivityItem[];
  teacherNotes?: string;
}

export interface ActivitySheet {
  id: string;
  user_id: string;
  title: string;
  subject: string; // Biology
  exam_board: string; // qualification label, e.g. "Edexcel GCSE Biology"
  course_level: string; // year group
  topic: string;
  activity_type: string;
  difficulty: string;
  content: ActivitySheetContent | null;
  model: string | null;
  generation_status: GenerationStatus;
  review_status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

/* ----------------------------- Assessments ---------------------------- */

export type AssessmentQuestionType =
  | 'multiple-choice'
  | 'short-answer'
  | 'data'
  | 'practical'
  | 'extended';

export interface AssessmentItem {
  number: number;
  type: AssessmentQuestionType;
  /** The student-facing question. */
  prompt: string;
  /** Choices for multiple-choice questions (labelled A, B, C… in order). */
  options?: string[];
  marks: number;
  /** Mark scheme / model answer (shown only on the teacher version). */
  markScheme: string;
}

/** Structured assessment content — source of truth for the paper + mark scheme. */
export interface AssessmentContent {
  /** Student-facing instructions. */
  intro: string;
  totalMarks: number;
  estimatedMinutes: number;
  items: AssessmentItem[];
  teacherNotes?: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  title: string;
  subject: string; // Biology
  exam_board: string; // qualification label, e.g. "Edexcel GCSE Biology"
  course_level: string; // year group
  topic: string;
  assessment_type: string;
  difficulty: string;
  question_count: number;
  content: AssessmentContent | null;
  model: string | null;
  generation_status: GenerationStatus;
  review_status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

export interface PromptTemplate {
  key: string;
  label: string;
  description: string | null;
  content: string;
  updated_at: string;
  updated_by: string | null;
}

export interface Subscription {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string; // free|trialing|active|past_due|canceled
  price_id: string | null;
  current_period_end: string | null;
  updated_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string | null;
  pack_id: string | null;
  event: string;
  success: boolean;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_usd: number | null;
  error: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

/* ----------------------- Curriculum concept graph --------------------- */
// Lightweight app-layer view models — decoupled from the Convex Doc shapes so
// pages/components depend on a stable surface. Ids are plain strings.

export type ConceptDifficulty = 'foundational' | 'developing' | 'secure' | 'stretch';
export type ConceptAbility = 'support' | 'core' | 'challenge';

export interface SubjectView {
  id: string;
  slug: string;
  name: string;
}

export interface YearStageView {
  id: string;
  slug: string;
  name: string;
  phase: string;
  orderIndex: number;
}

export interface TopicView {
  id: string;
  subjectId: string;
  yearStageId: string;
  title: string;
  description: string;
  orderIndex: number;
}

/** A concept as shown in lists / graph links. */
export interface ConceptView {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  difficultyLevel: ConceptDifficulty;
  orderIndex: number;
}

/** The full concept for the detail page. */
export interface ConceptDetailView extends ConceptView {
  subjectId: string;
  yearStageId: string;
  topicId: string;
  detailedExplanation: string;
  priorLearningSummary: string;
  nextLearningSummary: string;
  commonMisconceptions: string[];
  keyVocabulary: string[];
  lessonGuidance: string;
  assessmentGuidance: string;
  practicalLinks: string[];
  abilitySuitability: ConceptAbility[];
  scienceSkillsLinks: string[];
}

/** A tenant resource linked to a concept (as listed on the detail page). */
export interface ConceptResourceView {
  id: string;
  title: string;
  summary: string;
  resourceType: string;
  abilityLevel: ConceptAbility;
  status: string;
  created_at: string;
}

/** Everything the concept detail page renders, composed server-side. */
export interface ConceptDetailBundle {
  concept: ConceptDetailView;
  subjectName: string;
  yearStageName: string;
  topicTitle: string;
  prior: ConceptView[];
  next: ConceptView[];
  related: ConceptView[];
  resources: ConceptResourceView[];
}
