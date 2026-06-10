import 'server-only';
import { fetchMutation, fetchQuery } from 'convex/nextjs';
import { api } from '../../convex/_generated/api';
import type { Doc, Id } from '../../convex/_generated/dataModel';
import { getConvexToken } from './convexClient';
import { PREVIEW_PACKS, isPreviewMode } from './preview';
import { buildMockContent } from './generation/mock';
import type { GenerationInput } from './generation';
import type { Pack, PackContent } from './types';

/**
 * Central data access for lesson packs.
 *
 * In preview mode (no backend) newly generated packs are held in a module-level
 * in-memory store so the full loop is demoable without a database. In real mode
 * everything goes through Convex (queries/mutations scope rows to the user).
 */
const previewStore: Pack[] = [];

/** Maps a Convex pack document onto the app's Pack shape. */
function toPack(doc: Doc<'packs'>): Pack {
  return {
    id: doc._id,
    user_id: doc.user_id,
    topic: doc.topic,
    subject: doc.subject,
    exam_board: doc.exam_board,
    course_level: doc.course_level,
    ability_level: doc.ability_level,
    lesson_length: doc.lesson_length ?? null,
    learning_objectives: doc.learning_objectives ?? null,
    teacher_notes_input: doc.teacher_notes_input ?? null,
    content: (doc.content as PackContent | undefined) ?? null,
    model: doc.model ?? null,
    generation_status: doc.generation_status,
    generation_error: doc.generation_error ?? null,
    review_status: doc.review_status,
    created_at: new Date(doc._creationTime).toISOString(),
    updated_at: doc.updated_at,
  };
}

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

  const token = await getConvexToken();
  return await fetchMutation(
    api.packs.create,
    {
      topic: input.topic,
      subject: input.subject,
      exam_board: input.examBoard,
      course_level: input.courseLevel,
      ability_level: input.abilityLevel,
      lesson_length: input.lessonLength || undefined,
      learning_objectives: input.learningObjectives || undefined,
      teacher_notes_input: input.teacherNotes || undefined,
      content,
      model,
    },
    { token },
  );
}

/** Lists the current user's packs (newest first) for the dashboard. */
export async function listPacks(): Promise<Partial<Pack>[]> {
  if (isPreviewMode()) return [...previewStore, ...PREVIEW_PACKS];

  const token = await getConvexToken();
  const rows = await fetchQuery(api.packs.list, {}, { token });
  return rows.map((r) => ({
    id: r._id,
    topic: r.topic,
    subject: r.subject,
    exam_board: r.exam_board,
    course_level: r.course_level,
    ability_level: r.ability_level,
    generation_status: r.generation_status,
    review_status: r.review_status,
    created_at: new Date(r._creationTime).toISOString(),
  }));
}

/** Fetches one pack by id (Convex scopes ownership in real mode). */
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

  const token = await getConvexToken();
  try {
    const doc = await fetchQuery(
      api.packs.get,
      { id: id as Id<'packs'> },
      { token },
    );
    return doc ? toPack(doc) : null;
  } catch {
    // Malformed or unknown id → treat as not found (matches the old maybeSingle).
    return null;
  }
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
