import { isBackendConfigured } from './backend';
import type { UsageSummary } from './subscription';
import type { ActivitySheet, Assessment, Pack, Profile } from './types';

/**
 * Preview mode: when the backend isn't configured yet (no keys), the protected
 * pages render with sample data instead of redirecting to login. This lets the
 * customer see the full UI before any backend exists. As soon as real Clerk +
 * Convex keys are present, `isBackendConfigured()` becomes true and real auth +
 * data take over automatically.
 */
export function isPreviewMode(): boolean {
  return !isBackendConfigured();
}

export const PREVIEW_PROFILE: Profile = {
  id: 'preview-user',
  email: 'demo@school.example',
  full_name: 'Demo Teacher',
  school: 'Springfield International School',
  role: 'owner', // owner so the Admin page is also viewable in preview
  isPlatformAdmin: true, // preview shows curriculum-authoring affordances too
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const PREVIEW_USAGE: UsageSummary = {
  used: 1,
  limit: 3,
  remaining: 2,
  status: 'free',
  isSubscribed: false,
  canGenerate: true,
};

export const PREVIEW_PACKS: Pack[] = [
  {
    id: 'preview-pack-1',
    user_id: 'preview-user',
    topic: 'Photosynthesis',
    subject: 'Biology',
    exam_board: 'Edexcel GCSE Biology',
    course_level: 'Year 10',
    ability_level: 'Mixed ability',
    lesson_length: '60 minutes',
    learning_objectives:
      'Describe the process of photosynthesis and the factors affecting its rate.',
    teacher_notes_input: 'Period 4, low-energy class — needs a strong starter.',
    content: null,
    model: 'claude-sonnet-4-6',
    generation_status: 'complete',
    generation_error: null,
    review_status: 'approved',
    created_at: '2026-06-05T09:15:00.000Z',
    updated_at: '2026-06-05T09:16:00.000Z',
  },
  {
    id: 'preview-pack-2',
    user_id: 'preview-user',
    topic: 'Enzymes and digestion',
    subject: 'Biology',
    exam_board: 'Edexcel GCSE Biology',
    course_level: 'Year 10',
    ability_level: 'Support',
    lesson_length: '60 minutes',
    learning_objectives: 'Explain how enzymes break down food in digestion.',
    teacher_notes_input: null,
    content: null,
    model: 'claude-sonnet-4-6',
    generation_status: 'complete',
    generation_error: null,
    review_status: 'needs_review',
    created_at: '2026-06-06T13:40:00.000Z',
    updated_at: '2026-06-06T13:41:00.000Z',
  },
  {
    id: 'preview-pack-3',
    user_id: 'preview-user',
    topic: 'The heart and circulatory system',
    subject: 'Biology',
    exam_board: 'Edexcel International GCSE Biology',
    course_level: 'Year 11',
    ability_level: 'Challenge',
    lesson_length: '90 minutes',
    learning_objectives:
      'Analyse the structure of the heart and the cardiac cycle.',
    teacher_notes_input: 'Include an exam-style 6-marker.',
    content: null,
    model: 'claude-sonnet-4-6',
    generation_status: 'complete',
    generation_error: null,
    review_status: 'draft',
    created_at: '2026-06-07T08:05:00.000Z',
    updated_at: '2026-06-07T08:06:00.000Z',
  },
];

export const PREVIEW_ACTIVITY_SHEETS: ActivitySheet[] = [
  {
    id: 'preview-activity-1',
    user_id: 'preview-user',
    title: 'Cell structure — labelling activity',
    subject: 'Biology',
    exam_board: 'Edexcel GCSE Biology',
    course_level: 'Year 10',
    topic: 'Cell structure',
    activity_type: 'Labelling activity',
    difficulty: 'Core',
    content: null,
    model: 'claude-sonnet-4-6',
    generation_status: 'complete',
    review_status: 'approved',
    created_at: '2026-06-06T10:00:00.000Z',
    updated_at: '2026-06-06T10:01:00.000Z',
  },
  {
    id: 'preview-activity-2',
    user_id: 'preview-user',
    title: 'Enzymes — retrieval questions',
    subject: 'Biology',
    exam_board: 'Edexcel International GCSE Biology',
    course_level: 'Year 11',
    topic: 'Enzymes',
    activity_type: 'Retrieval questions',
    difficulty: 'Support',
    content: null,
    model: 'claude-sonnet-4-6',
    generation_status: 'complete',
    review_status: 'draft',
    created_at: '2026-06-07T14:00:00.000Z',
    updated_at: '2026-06-07T14:01:00.000Z',
  },
];

export const PREVIEW_ASSESSMENTS: Assessment[] = [
  {
    id: 'preview-assessment-1',
    user_id: 'preview-user',
    title: 'Photosynthesis — end-of-topic test',
    subject: 'Biology',
    exam_board: 'Edexcel GCSE Biology',
    course_level: 'Year 10',
    topic: 'Photosynthesis',
    assessment_type: 'End-of-topic test',
    difficulty: 'Core',
    question_count: 10,
    content: null,
    model: 'claude-sonnet-4-6',
    generation_status: 'complete',
    review_status: 'approved',
    created_at: '2026-06-06T11:00:00.000Z',
    updated_at: '2026-06-06T11:01:00.000Z',
  },
  {
    id: 'preview-assessment-2',
    user_id: 'preview-user',
    title: 'Cell structure — starter quiz',
    subject: 'Biology',
    exam_board: 'Edexcel International GCSE Biology',
    course_level: 'Year 9',
    topic: 'Cell structure',
    assessment_type: 'Starter quiz',
    difficulty: 'Support',
    question_count: 5,
    content: null,
    model: 'claude-sonnet-4-6',
    generation_status: 'complete',
    review_status: 'draft',
    created_at: '2026-06-08T09:30:00.000Z',
    updated_at: '2026-06-08T09:31:00.000Z',
  },
];
