/**
 * Central app configuration and MVP defaults.
 *
 * This is the SINGLE place for business defaults so nothing is hard-coded in
 * random spots. Values here can be overridden at runtime by the `app_settings`
 * table (editable from the admin area), which always takes precedence — see
 * `getSetting()` in `src/lib/settings.ts`.
 *
 * Product scope (locked):
 *   - Subject: Biology only
 *   - Qualifications: Pearson Edexcel GCSE Biology + Edexcel International GCSE
 *     Biology. No other subjects, boards or curricula are exposed in the UI.
 *   - Year groups: Year 9–11 (KS4)
 *
 * The structure is intentionally scalable (lists of qualifications/levels) so
 * more can be added later, but only the supported options are surfaced.
 */

export const REVIEW_STATUSES = ['draft', 'needs_review', 'approved'] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export const GENERATION_STATUSES = [
  'pending',
  'generating',
  'complete',
  'failed',
] as const;
export type GenerationStatus = (typeof GENERATION_STATUSES)[number];

export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME ?? 'Lessons Generator',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@example.com',

  /** Subject — locked to Biology. */
  subject: 'Biology',

  /**
   * Supported qualifications. Only these two are offered. `id` is stable for
   * storage/links; `examBoard` + `courseLevel` map onto the existing `packs`
   * columns so no schema change is needed.
   */
  qualifications: [
    {
      id: 'edexcel-gcse-biology',
      label: 'Edexcel GCSE Biology',
      short: 'GCSE Biology',
      examBoard: 'Pearson Edexcel',
      courseLevel: 'GCSE',
      tiers: ['Foundation', 'Higher'],
    },
    {
      id: 'edexcel-igcse-biology',
      label: 'Edexcel International GCSE Biology',
      short: 'International GCSE Biology',
      examBoard: 'Pearson Edexcel',
      courseLevel: 'International GCSE',
      tiers: [],
    },
  ] as const,
  defaultQualificationId: 'edexcel-gcse-biology',

  /** Year groups (KS4). */
  yearGroups: ['Year 9', 'Year 10', 'Year 11'] as const,

  /** Class level / differentiation offered on the form. */
  classLevels: ['Support', 'Core', 'Challenge', 'Mixed ability'] as const,

  /** Printable activity-sheet types a teacher can generate. */
  activityTypes: [
    'Labelling activity',
    'Matching activity',
    'Retrieval questions',
    'Gap-fill',
    'Keyword activity',
    'Data interpretation',
    'Practical method',
    'Exam-question practice',
    'Revision checklist',
    'Homework sheet',
  ] as const,

  lessonLengths: ['30 minutes', '45 minutes', '60 minutes', '90 minutes'] as const,

  /** Whether the referral-reward flow is live. Off until the backend exists. */
  referralEnabled: process.env.NEXT_PUBLIC_REFERRAL_ENABLED === 'true',

  // --- Legacy/back-compat (not surfaced in the UI) ---------------------------
  /** Retained so existing `packs` rows + generator types keep working. */
  examBoards: ['Pearson Edexcel'] as const,
  defaultExamBoard: process.env.NEXT_PUBLIC_DEFAULT_EXAM_BOARD ?? 'Pearson Edexcel',
  courseLevels: ['GCSE', 'International GCSE'] as const,
  /** Differentiation tiers used by the three generated worksheets. */
  abilityLevels: ['Foundation', 'Standard', 'Mastery', 'Mixed'] as const,

  /** Free packs before the paywall. DB `app_settings` overrides this default. */
  freeTrialPackLimit: Number(process.env.FREE_TRIAL_PACK_LIMIT ?? 3),

  ai: {
    /** Default model balances quality/cost. claude-opus-4-8 for top quality. */
    model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
  },
} as const;

export type AppConfig = typeof APP_CONFIG;

export type Qualification = (typeof APP_CONFIG.qualifications)[number];

/** Resolve a qualification by its stable id, falling back to the default. */
export function getQualification(id?: string | null): Qualification {
  return (
    APP_CONFIG.qualifications.find((q) => q.id === id) ??
    APP_CONFIG.qualifications.find((q) => q.id === APP_CONFIG.defaultQualificationId) ??
    APP_CONFIG.qualifications[0]
  );
}

/** The standing compliance line shown wherever generated content appears. */
export const PEARSON_NOTICE =
  'Designed to support teaching of Pearson Edexcel GCSE Biology and International GCSE Biology. Not endorsed by Pearson — review generated content before classroom use.';
