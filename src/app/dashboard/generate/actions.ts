'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireProfile } from '@/lib/auth';
import { getUsageSummary } from '@/lib/subscription';
import { generatePackSchema } from '@/lib/validation';
import { getPrompts } from '@/lib/prompts';
import { getGenerator, type GenerationInput } from '@/lib/generation';
import { createGeneratedPack } from '@/lib/packs';
import { logUsage } from '@/lib/usage';
import { APP_CONFIG } from '@/lib/config';

export type GenerateState = { error?: string } | null;

export async function generatePackAction(
  _prev: GenerateState,
  formData: FormData,
): Promise<GenerateState> {
  await requireProfile();

  // Paywall gate — block generation past the free-trial limit.
  const usage = await getUsageSummary();
  if (usage && !usage.canGenerate) {
    return {
      error:
        'You have used all your free packs. Subscribe from your account page to keep generating.',
    };
  }

  const parsed = generatePackSchema.safeParse({
    topic: formData.get('topic'),
    examBoard: formData.get('examBoard'),
    courseLevel: formData.get('courseLevel'),
    abilityLevel: formData.get('abilityLevel'),
    lessonLength: formData.get('lessonLength'),
    learningObjectives: formData.get('learningObjectives'),
    teacherNotes: formData.get('teacherNotes'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }

  const input: GenerationInput = {
    subject: APP_CONFIG.subject, // locked to Biology (MVP)
    topic: parsed.data.topic,
    examBoard: parsed.data.examBoard,
    courseLevel: parsed.data.courseLevel,
    abilityLevel: parsed.data.abilityLevel,
    lessonLength: parsed.data.lessonLength,
    learningObjectives: parsed.data.learningObjectives ?? '',
    teacherNotes: parsed.data.teacherNotes ?? '',
  };

  let packId: string;
  try {
    await logUsage({ event: 'generation_started', success: true });
    const prompts = await getPrompts();
    const generator = getGenerator();
    const { content, usage: genUsage } = await generator.generate(input, prompts);
    packId = await createGeneratedPack(input, content, genUsage.model);
    await logUsage({
      event: 'generation_complete',
      success: true,
      packId,
      inputTokens: genUsage.inputTokens,
      outputTokens: genUsage.outputTokens,
      costUsd: genUsage.costUsd,
      metadata: { model: genUsage.model },
    });
  } catch (err) {
    await logUsage({
      event: 'generation_failed',
      success: false,
      error: err instanceof Error ? err.message : String(err),
    });
    return {
      error: 'Generation failed. Please try again — your free pack was not used.',
    };
  }

  revalidatePath('/dashboard');
  redirect(`/dashboard/packs/${packId}`);
}
