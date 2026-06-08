import { createClient } from './supabase/server';
import { isPreviewMode } from './preview';
import type { PromptTemplate } from './types';

export const PROMPT_KEYS = [
  'safety',
  'main',
  'lesson_plan',
  'slides',
  'worksheets',
  'assessment',
  'teacher_notes',
] as const;

export type PromptKey = (typeof PROMPT_KEYS)[number];

/**
 * In-code defaults that mirror `supabase/seed.sql`. The database is the source
 * of truth (the customer edits prompts in the admin area without a code
 * change); these defaults are only a fallback so the app still works in
 * preview mode or if a prompt row is missing.
 */
export const DEFAULT_PROMPTS: Record<
  PromptKey,
  { label: string; description: string; content: string }
> = {
  safety: {
    label: 'Safety / originality rules',
    description: 'Always-applied rules. Prepended to every generation.',
    content:
      'You generate ORIGINAL, exam-style educational materials only. Never copy, reproduce, paraphrase or imitate real past papers or official mark schemes. Never include student personal data. Content must be factually accurate, age-appropriate, classroom-ready, and in clear British English.',
  },
  main: {
    label: 'Main lesson pack generation',
    description: 'Top-level instruction that orchestrates the full pack.',
    content:
      'You are an expert {{subject}} teacher and resource author for the {{exam_board}} {{course_level}} specification. Create a complete, original, classroom-ready lesson resource pack for "{{topic}}" ({{ability_level}}, {{lesson_length}}). Objectives: {{learning_objectives}}. Teacher notes: {{teacher_notes_input}}.',
  },
  lesson_plan: {
    label: 'Lesson plan generation',
    description: 'Instruction for the timed lesson plan section.',
    content:
      'Write a timed lesson plan for "{{topic}}" ({{lesson_length}}, {{ability_level}}): objectives, success criteria, starter, main teaching sequence with timings, guided and independent practice, key vocabulary, resources, and a plenary.',
  },
  slides: {
    label: 'Slide generation',
    description: 'Instruction for the presentation slide content.',
    content:
      'Produce slide-by-slide content for "{{topic}}": title slide, learning objectives, starter, explanation/content slides, guided practice, independent practice, assessment/plenary, with teacher notes where useful.',
  },
  worksheets: {
    label: 'Worksheet generation',
    description: 'Instruction for the three differentiated worksheets.',
    content:
      'Create three differentiated worksheets for "{{topic}}": Foundation (scaffolded), Standard (grade-appropriate), Mastery (stretch/challenge). Each has original questions and a matching answer key.',
  },
  assessment: {
    label: 'Assessment generation',
    description: 'Instruction for the assessment questions.',
    content:
      'Write an original, exam-style assessment for "{{topic}}" aligned to {{exam_board}} {{course_level}}, mixing recall, application and extended-response questions with marks shown. Do not reproduce real past-paper questions.',
  },
  teacher_notes: {
    label: 'Teacher notes generation',
    description: 'Instruction for teacher-facing notes and the mark scheme.',
    content:
      'Write teacher notes for "{{topic}}": common misconceptions, key teaching points, suggested questioning, safety/practical notes if relevant, and a clear original mark scheme.',
  },
};

/** Loads all prompt templates (DB over defaults). Used by generation + admin. */
export async function getPrompts(): Promise<Record<PromptKey, string>> {
  const result = {} as Record<PromptKey, string>;
  for (const key of PROMPT_KEYS) result[key] = DEFAULT_PROMPTS[key].content;

  if (isPreviewMode()) return result;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('prompt_templates')
      .select('key, content');
    for (const row of (data as Pick<PromptTemplate, 'key' | 'content'>[]) ?? []) {
      if ((PROMPT_KEYS as readonly string[]).includes(row.key)) {
        result[row.key as PromptKey] = row.content;
      }
    }
  } catch {
    // fall back to defaults
  }
  return result;
}
