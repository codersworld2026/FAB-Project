import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// Shared enums (ported from the Postgres `generation_status` / `review_status`
// / `user_role` types). Stored as string unions so the app's TS types map 1:1.
const generationStatus = v.union(
  v.literal('pending'),
  v.literal('generating'),
  v.literal('complete'),
  v.literal('failed'),
);

const reviewStatus = v.union(
  v.literal('draft'),
  v.literal('needs_review'),
  v.literal('approved'),
);

// Document shapes mirror the interfaces in src/lib/types.ts so the data layer
// is a near pass-through:
//   - the app-facing `id` comes from Convex's built-in `_id`
//   - `created_at` is derived from the built-in `_creationTime`
//   - `updated_at` is stored explicitly and bumped by mutations
//   - nullable columns are modelled as v.optional(...) and read back as `?? null`
//   - `user_id` holds the Clerk user id (the auth subject), matching the old
//     Supabase model where user_id === auth.uid()
export default defineSchema({
  // One row per teacher. `clerk_id` is the Clerk user id and is the value the
  // app exposes as Profile.id.
  profiles: defineTable({
    clerk_id: v.string(),
    email: v.string(),
    full_name: v.optional(v.string()),
    school: v.optional(v.string()),
    role: v.union(v.literal('teacher'), v.literal('owner')),
    // Platform-admin flag — the ONLY thing that grants curriculum-write access.
    // Optional so the pre-existing profile row still validates; checked `=== true`.
    is_platform_admin: v.optional(v.boolean()),
    updated_at: v.string(),
  }).index('by_clerk_id', ['clerk_id']),

  // --- Multi-tenancy (camelCase; new domain) ---------------------------------
  // Every user owns a personal organisation (type "individual"); schools/trusts
  // come later. Created lazily by profiles.ensureProfile.
  organizations: defineTable({
    name: v.string(),
    type: v.union(
      v.literal('school'),
      v.literal('trust'),
      v.literal('individual'),
    ),
    createdAt: v.string(),
  }),

  // Links a user (Clerk subject) to an organisation with a role. `isDefault`
  // marks the user's active org; `createdAt` orders fallback resolution.
  memberships: defineTable({
    userId: v.string(),
    organizationId: v.id('organizations'),
    role: v.union(
      v.literal('owner'),
      v.literal('dept_lead'),
      v.literal('teacher'),
    ),
    subjectScope: v.optional(v.array(v.string())),
    createdAt: v.string(),
    isDefault: v.boolean(),
  })
    .index('by_user', ['userId'])
    .index('by_user_default', ['userId', 'isDefault'])
    .index('by_org', ['organizationId']),

  // Generated lesson resource packs. `content` (jsonb) is the source of truth.
  packs: defineTable({
    user_id: v.string(),
    topic: v.string(),
    subject: v.string(),
    exam_board: v.string(),
    course_level: v.string(),
    ability_level: v.string(),
    lesson_length: v.optional(v.string()),
    learning_objectives: v.optional(v.string()),
    teacher_notes_input: v.optional(v.string()),
    content: v.optional(v.any()), // PackContent
    model: v.optional(v.string()),
    generation_status: generationStatus,
    generation_error: v.optional(v.string()),
    review_status: reviewStatus,
    updated_at: v.string(),
  }).index('by_user', ['user_id']),

  // Editable AI instructions, keyed by stage (e.g. 'main', 'safety').
  prompt_templates: defineTable({
    key: v.string(),
    label: v.string(),
    description: v.optional(v.string()),
    content: v.string(),
    updated_at: v.string(),
    updated_by: v.optional(v.string()),
  }).index('by_key', ['key']),

  // Runtime-configurable values that override src/lib/config.ts defaults.
  app_settings: defineTable({
    key: v.string(),
    value: v.any(),
    updated_at: v.string(),
    updated_by: v.optional(v.string()),
  }).index('by_key', ['key']),

  // One row per teacher; mirrors Stripe state.
  subscriptions: defineTable({
    user_id: v.string(),
    stripe_customer_id: v.optional(v.string()),
    stripe_subscription_id: v.optional(v.string()),
    status: v.string(), // free|trialing|active|past_due|canceled
    price_id: v.optional(v.string()),
    current_period_end: v.optional(v.string()),
    updated_at: v.string(),
  })
    .index('by_user', ['user_id'])
    .index('by_stripe_customer', ['stripe_customer_id']),

  // Generation + export events for usage tracking and cost monitoring.
  usage_logs: defineTable({
    user_id: v.optional(v.string()),
    pack_id: v.optional(v.id('packs')),
    event: v.string(),
    success: v.boolean(),
    input_tokens: v.optional(v.number()),
    output_tokens: v.optional(v.number()),
    cost_usd: v.optional(v.number()),
    error: v.optional(v.string()),
    metadata: v.optional(v.any()),
  }).index('by_user', ['user_id']),

  // Printable activities (one per row).
  activity_sheets: defineTable({
    user_id: v.string(),
    title: v.string(),
    subject: v.string(),
    exam_board: v.string(),
    course_level: v.string(),
    topic: v.string(),
    activity_type: v.string(),
    difficulty: v.string(),
    content: v.optional(v.any()), // ActivitySheetContent
    model: v.optional(v.string()),
    generation_status: generationStatus,
    review_status: reviewStatus,
    updated_at: v.string(),
  }).index('by_user', ['user_id']),

  // Quizzes / tests / exam-style question sets (one per row).
  assessments: defineTable({
    user_id: v.string(),
    title: v.string(),
    subject: v.string(),
    exam_board: v.string(),
    course_level: v.string(),
    topic: v.string(),
    assessment_type: v.string(),
    difficulty: v.string(),
    question_count: v.number(),
    content: v.optional(v.any()), // AssessmentContent
    model: v.optional(v.string()),
    generation_status: generationStatus,
    review_status: reviewStatus,
    updated_at: v.string(),
  }).index('by_user', ['user_id']),
});
