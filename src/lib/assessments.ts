import 'server-only';
import { createClient } from './supabase/server';
import { PREVIEW_ASSESSMENTS, isPreviewMode } from './preview';
import { buildMockAssessment, type AssessmentInput } from './generation/assessmentMock';
import type { Assessment, AssessmentContent } from './types';

/**
 * Data access for assessments — mirrors `lib/activitySheets.ts`. In preview
 * mode (no Supabase) new assessments live in a module-level in-memory store so
 * the full create → view loop is demoable without a database. In real mode
 * everything goes through Supabase (RLS scopes rows to the user).
 */
const previewStore: Assessment[] = [];

const LIST_COLUMNS =
  'id, title, subject, exam_board, course_level, topic, assessment_type, difficulty, question_count, generation_status, review_status, created_at';

/** Saves a freshly generated assessment and returns its id. */
export async function createAssessment(
  input: AssessmentInput,
  content: AssessmentContent,
  model: string,
): Promise<string> {
  if (isPreviewMode()) {
    const now = new Date().toISOString();
    const id = `asmt-${Date.now()}`;
    previewStore.unshift({
      id,
      user_id: 'preview-user',
      title: input.title,
      subject: input.subject,
      exam_board: input.examBoard,
      course_level: input.courseLevel,
      topic: input.topic,
      assessment_type: input.assessmentType,
      difficulty: input.difficulty,
      question_count: input.questionCount,
      content,
      model,
      generation_status: 'complete',
      review_status: 'draft',
      created_at: now,
      updated_at: now,
    });
    return id;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated.');

  const { data, error } = await supabase
    .from('assessments')
    .insert({
      user_id: user.id,
      title: input.title,
      subject: input.subject,
      exam_board: input.examBoard,
      course_level: input.courseLevel,
      topic: input.topic,
      assessment_type: input.assessmentType,
      difficulty: input.difficulty,
      question_count: input.questionCount,
      content,
      model,
      generation_status: 'complete',
      review_status: 'draft',
    })
    .select('id')
    .single();

  if (error || !data) throw new Error(error?.message ?? 'Failed to save assessment.');
  return data.id as string;
}

/** Lists the current user's assessments (newest first). */
export async function listAssessments(): Promise<Partial<Assessment>[]> {
  if (isPreviewMode()) return [...previewStore, ...PREVIEW_ASSESSMENTS];

  const supabase = await createClient();
  const { data } = await supabase
    .from('assessments')
    .select(LIST_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(30);
  return (data ?? []) as Partial<Assessment>[];
}

/** Fetches one assessment by id (RLS ensures ownership in real mode). */
export async function getAssessment(id: string): Promise<Assessment | null> {
  if (isPreviewMode()) {
    const found =
      previewStore.find((a) => a.id === id) ??
      PREVIEW_ASSESSMENTS.find((a) => a.id === id) ??
      null;
    if (found && !found.content) {
      return { ...found, content: buildMockAssessment(assessmentToInput(found)) };
    }
    return found;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return (data as Assessment) ?? null;
}

function assessmentToInput(assessment: Assessment): AssessmentInput {
  return {
    title: assessment.title,
    subject: assessment.subject,
    examBoard: assessment.exam_board,
    courseLevel: assessment.course_level,
    topic: assessment.topic,
    assessmentType: assessment.assessment_type,
    difficulty: assessment.difficulty,
    questionCount: assessment.question_count,
    notes: '',
  };
}
