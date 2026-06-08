/**
 * Central app configuration and MVP defaults.
 *
 * This is the SINGLE place for business defaults so nothing is hard-coded in
 * random spots. Values here can be overridden at runtime by the `app_settings`
 * table (editable from the admin area), which always takes precedence — see
 * `getSetting()` in `src/lib/settings.ts`.
 *
 * MVP scope is deliberately narrow (per customer brief):
 *   - Subject: Biology only
 *   - One exam board (Edexcel suggested; customer to lock)
 *   - Course level pending customer lock (KS3 explicitly excluded from MVP)
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

  /** MVP subject — locked to Biology. */
  subject: 'Biology',

  /** Exam boards offered. MVP ships one; structured as a list to add more later. */
  examBoards: ['Edexcel'] as const,
  defaultExamBoard: process.env.NEXT_PUBLIC_DEFAULT_EXAM_BOARD ?? 'Edexcel',

  /** Course levels. Pending customer lock — KS3 excluded from MVP. */
  courseLevels: ['IGCSE', 'GCSE', 'A-Level'] as const,

  /** Differentiation tiers used across worksheets + form. */
  abilityLevels: ['Foundation', 'Standard', 'Mastery', 'Mixed'] as const,

  lessonLengths: [
    '30 minutes',
    '50 minutes',
    '60 minutes',
    '90 minutes (double)',
  ] as const,

  /** Free packs before the paywall. DB `app_settings` overrides this default. */
  freeTrialPackLimit: Number(process.env.FREE_TRIAL_PACK_LIMIT ?? 3),

  ai: {
    /** Default model balances quality/cost. claude-opus-4-8 for top quality. */
    model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
