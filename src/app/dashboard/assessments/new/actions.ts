'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireProfile } from '@/lib/auth';
import { getUsageSummary } from '@/lib/subscription';
import { assessmentSchema } from '@/lib/validation';
import { buildMockAssessment, type AssessmentInput } from '@/lib/generation/assessmentMock';
import { createAssessment } from '@/lib/assessments';
import { APP_CONFIG } from '@/lib/config';

export type AssessmentState = { error?: string } | null;

export async function createAssessmentAction(
  _prev: AssessmentState,
  formData: FormData,
): Promise<AssessmentState> {
  await requireProfile();

  const usage = await getUsageSummary();
  if (usage && !usage.canGenerate) {
    return {
      error:
        'You have used all your free generations. Subscribe from your account page to keep creating.',
    };
  }

  const parsed = assessmentSchema.safeParse({
    title: formData.get('title'),
    topic: formData.get('topic'),
    examBoard: formData.get('examBoard'),
    courseLevel: formData.get('courseLevel'),
    assessmentType: formData.get('assessmentType'),
    difficulty: formData.get('difficulty'),
    questionCount: formData.get('questionCount'),
    notes: formData.get('notes'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }

  const title =
    parsed.data.title?.trim() || `${parsed.data.topic} — ${parsed.data.assessmentType}`;

  const input: AssessmentInput = {
    title,
    subject: APP_CONFIG.subject,
    examBoard: parsed.data.examBoard,
    courseLevel: parsed.data.courseLevel,
    topic: parsed.data.topic,
    assessmentType: parsed.data.assessmentType,
    difficulty: parsed.data.difficulty,
    questionCount: parsed.data.questionCount,
    notes: parsed.data.notes ?? '',
  };

  let id: string;
  try {
    const content = buildMockAssessment(input);
    id = await createAssessment(input, content, 'mock');
  } catch {
    return { error: 'Generation failed. Please try again.' };
  }

  revalidatePath('/dashboard/assessments');
  redirect(`/dashboard/assessments/${id}`);
}
