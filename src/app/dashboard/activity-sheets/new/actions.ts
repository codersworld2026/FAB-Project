'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireProfile } from '@/lib/auth';
import { getUsageSummary } from '@/lib/subscription';
import { activitySheetSchema } from '@/lib/validation';
import { buildMockActivitySheet, type ActivitySheetInput } from '@/lib/generation/activityMock';
import { createActivitySheet } from '@/lib/activitySheets';
import { APP_CONFIG } from '@/lib/config';

export type ActivityState = { error?: string } | null;

export async function createActivitySheetAction(
  _prev: ActivityState,
  formData: FormData,
): Promise<ActivityState> {
  await requireProfile();

  const usage = await getUsageSummary();
  if (usage && !usage.canGenerate) {
    return {
      error:
        'You have used all your free generations. Subscribe from your account page to keep creating.',
    };
  }

  const parsed = activitySheetSchema.safeParse({
    title: formData.get('title'),
    topic: formData.get('topic'),
    examBoard: formData.get('examBoard'),
    courseLevel: formData.get('courseLevel'),
    activityType: formData.get('activityType'),
    difficulty: formData.get('difficulty'),
    notes: formData.get('notes'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }

  const title =
    parsed.data.title?.trim() || `${parsed.data.topic} — ${parsed.data.activityType}`;

  const input: ActivitySheetInput = {
    title,
    subject: APP_CONFIG.subject,
    examBoard: parsed.data.examBoard,
    courseLevel: parsed.data.courseLevel,
    topic: parsed.data.topic,
    activityType: parsed.data.activityType,
    difficulty: parsed.data.difficulty,
    notes: parsed.data.notes ?? '',
  };

  let id: string;
  try {
    const content = buildMockActivitySheet(input);
    id = await createActivitySheet(input, content, 'mock');
  } catch {
    return { error: 'Generation failed. Please try again.' };
  }

  revalidatePath('/dashboard/activity-sheets');
  redirect(`/dashboard/activity-sheets/${id}`);
}
