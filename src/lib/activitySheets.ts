import 'server-only';
import { createClient } from './supabase/server';
import { PREVIEW_ACTIVITY_SHEETS, isPreviewMode } from './preview';
import { buildMockActivitySheet, type ActivitySheetInput } from './generation/activityMock';
import type { ActivitySheet, ActivitySheetContent } from './types';

/**
 * Data access for activity sheets — mirrors `lib/packs.ts`. In preview mode
 * (no Supabase) new sheets live in a module-level in-memory store so the full
 * create → view loop is demoable without a database. In real mode everything
 * goes through Supabase (RLS scopes rows to the user).
 */
const previewStore: ActivitySheet[] = [];

const LIST_COLUMNS =
  'id, title, subject, exam_board, course_level, topic, activity_type, difficulty, generation_status, review_status, created_at';

/** Saves a freshly generated activity sheet and returns its id. */
export async function createActivitySheet(
  input: ActivitySheetInput,
  content: ActivitySheetContent,
  model: string,
): Promise<string> {
  if (isPreviewMode()) {
    const now = new Date().toISOString();
    const id = `act-${Date.now()}`;
    previewStore.unshift({
      id,
      user_id: 'preview-user',
      title: input.title,
      subject: input.subject,
      exam_board: input.examBoard,
      course_level: input.courseLevel,
      topic: input.topic,
      activity_type: input.activityType,
      difficulty: input.difficulty,
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
    .from('activity_sheets')
    .insert({
      user_id: user.id,
      title: input.title,
      subject: input.subject,
      exam_board: input.examBoard,
      course_level: input.courseLevel,
      topic: input.topic,
      activity_type: input.activityType,
      difficulty: input.difficulty,
      content,
      model,
      generation_status: 'complete',
      review_status: 'draft',
    })
    .select('id')
    .single();

  if (error || !data) throw new Error(error?.message ?? 'Failed to save activity sheet.');
  return data.id as string;
}

/** Lists the current user's activity sheets (newest first). */
export async function listActivitySheets(): Promise<Partial<ActivitySheet>[]> {
  if (isPreviewMode()) return [...previewStore, ...PREVIEW_ACTIVITY_SHEETS];

  const supabase = await createClient();
  const { data } = await supabase
    .from('activity_sheets')
    .select(LIST_COLUMNS)
    .order('created_at', { ascending: false })
    .limit(30);
  return (data ?? []) as Partial<ActivitySheet>[];
}

/** Fetches one activity sheet by id (RLS ensures ownership in real mode). */
export async function getActivitySheet(id: string): Promise<ActivitySheet | null> {
  if (isPreviewMode()) {
    const found =
      previewStore.find((a) => a.id === id) ??
      PREVIEW_ACTIVITY_SHEETS.find((a) => a.id === id) ??
      null;
    if (found && !found.content) {
      return { ...found, content: buildMockActivitySheet(sheetToInput(found)) };
    }
    return found;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('activity_sheets')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return (data as ActivitySheet) ?? null;
}

function sheetToInput(sheet: ActivitySheet): ActivitySheetInput {
  return {
    title: sheet.title,
    subject: sheet.subject,
    examBoard: sheet.exam_board,
    courseLevel: sheet.course_level,
    topic: sheet.topic,
    activityType: sheet.activity_type,
    difficulty: sheet.difficulty,
    notes: '',
  };
}
