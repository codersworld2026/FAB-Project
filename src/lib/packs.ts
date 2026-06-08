import 'server-only';
import { createClient } from './supabase/server';
import { PREVIEW_PACKS, isPreviewMode } from './preview';
import { buildMockContent } from './generation/mock';
import type { GenerationInput } from './generation';
import type { Pack, PackContent } from './types';

/**
 * Central data access for lesson packs.
 *
 * In preview mode (no Supabase) newly generated packs are held in a
 * module-level in-memory store so the full loop is demoable without a database.
 * In real mode everything goes through Supabase (RLS scopes rows to the user).
 */
const previewStore: Pack[] = [];

const PACK_LIST_COLUMNS =
  'id, topic, subject, exam_board, course_level, ability_level, generation_status, review_status, created_at';

/** Saves a freshly generated pack and returns its id. */
export async function createGeneratedPack(
  input: GenerationInput,
  content: PackContent,
  model: string,
): Promise<string> {
  if (isPreviewMode()) {
    const now = new Date().toISOString();
    const id = `gen-${Date.now()}`;
    previewStore.unshift({
      id,
      user_id: 'preview-user',
      topic: input.topic,
      subject: input.subject,
      exam_board: input.examBoard,
      course_level: input.courseLevel,
      ability_level: input.abilityLevel,
      lesson_length: input.lessonLength,
      learning_objectives: input.learningObjectives || null,
      teacher_notes_input: input.teacherNotes || null,
      content,
      model,
      generation_status: 'complete',
      generation_error: null,
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
    .from('packs')
    .insert({
      user_id: user.id,
      topic: input.topic,
      subject: input.subject,
      exam_board: input.examBoard,
      course_level: input.courseLevel,
      ability_level: input.abilityLevel,
      lesson_length: input.lessonLength,
      learning_objectives: input.learningObjectives || null,
      teacher_notes_input: input.teacherNotes || null,
      content,
      model,
      generation_status: 'complete',
      review_status: 'draft',
    })
    .select('id')
    .single();

  if (error || !data) throw new Error(error?.message ?? 'Failed to save pack.');
  return data.id as string;
}

/** Lists the current user's packs (newest first) for the dashboard. */
export async function listPacks(): Promise<Partial<Pack>[]> {
  if (isPreviewMode()) return [...previewStore, ...PREVIEW_PACKS];

  const supabase = await createClient();
  const { data } = await supabase
    .from('packs')
    .select(PACK_LIST_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(20);
  return (data ?? []) as Partial<Pack>[];
}

/** Fetches one pack by id (RLS ensures ownership in real mode). */
export async function getPack(id: string): Promise<Pack | null> {
  if (isPreviewMode()) {
    const found =
      previewStore.find((p) => p.id === id) ??
      PREVIEW_PACKS.find((p) => p.id === id) ??
      null;
    if (found && !found.content) {
      // Fill sample packs with mock content so detail pages render fully.
      return { ...found, content: buildMockContent(packToInput(found)) };
    }
    return found;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('packs')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return (data as Pack) ?? null;
}

function packToInput(pack: Pack): GenerationInput {
  return {
    subject: pack.subject,
    topic: pack.topic,
    examBoard: pack.exam_board,
    courseLevel: pack.course_level,
    abilityLevel: pack.ability_level,
    lessonLength: pack.lesson_length ?? '',
    learningObjectives: pack.learning_objectives ?? '',
    teacherNotes: pack.teacher_notes_input ?? '',
  };
}
