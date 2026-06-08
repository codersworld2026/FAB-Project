import { z } from 'zod';

/**
 * Export view-model. A normalized, presentation-ready shape derived from a
 * saved Pack (metadata) + PackContent (structured JSON the generator produces).
 * Nothing here is fabricated wholesale — the few fields the generator doesn't
 * emit (success criteria, key vocabulary, resources, homework) are derived
 * deterministically from the lesson's own text in `buildExportLesson`.
 */
export interface ExportSlide {
  title: string;
  subtitle?: string;
  bulletPoints: string[];
  speakerNotes?: string;
  activity?: string;
}

export interface ExportWorksheet {
  level: string;
  title: string;
  intro?: string;
  questions: { prompt: string; marks?: number }[];
  answers: string[];
}

export interface ExportLesson {
  id: string;
  title: string;
  subject: string;
  examBoard: string;
  yearGroup: string;
  topic: string;
  duration: string;
  ability: string;
  summary: string;
  learningObjectives: string[];
  successCriteria: string[];
  keyVocabulary: string[];
  timeline: { title: string; durationMins?: number; detail: string }[];
  starterActivity: string;
  mainTeaching: string;
  guidedPractice: string;
  independentTask: string;
  plenary: string;
  assessmentQuestions: { prompt: string; marks: number }[];
  markScheme: { questionRef: string; answer: string; marks: number }[];
  differentiation: { level: string; detail: string }[];
  resourcesNeeded: string[];
  homework: string;
  teacherNotes: { misconceptions: string[]; teachingPoints: string[]; safety?: string };
  worksheets: ExportWorksheet[];
  slides: ExportSlide[];
}

/* ----------------------------- request options ----------------------------- */

export const pdfOptionsSchema = z.object({
  fullLessonPlan: z.boolean().default(true),
  studentWorksheet: z.boolean().default(false),
  answerSheet: z.boolean().default(false),
  includeTeacherNotes: z.boolean().default(true),
  includeHomework: z.boolean().default(true),
});
export type PdfOptions = z.infer<typeof pdfOptionsSchema>;

export const pptxOptionsSchema = z.object({
  deck: z.enum(['standard', 'detailed']).default('standard'),
  includeStarter: z.boolean().default(true),
  includeAssessment: z.boolean().default(true),
  includePlenary: z.boolean().default(true),
});
export type PptxOptions = z.infer<typeof pptxOptionsSchema>;

export const pdfRequestSchema = z.object({
  packId: z.string().min(1, 'Missing lesson id.'),
  options: pdfOptionsSchema.partial().optional(),
});

export const pptxRequestSchema = z.object({
  packId: z.string().min(1, 'Missing lesson id.'),
  options: pptxOptionsSchema.partial().optional(),
});

export const DEFAULT_PDF_OPTIONS: PdfOptions = pdfOptionsSchema.parse({});
export const DEFAULT_PPTX_OPTIONS: PptxOptions = pptxOptionsSchema.parse({});

/** Filesystem-safe slug for download filenames. */
export function slugifyTitle(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'lesson'
  );
}
