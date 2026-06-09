-- ============================================================================
-- FAB Project — Assessments (Phase 4)
--
-- Quizzes / tests / exam-style question sets (one per row). `content` (jsonb)
-- holds the structured paper + mark scheme; the paper and teacher (mark
-- scheme) views render from it. Mirrors the `packs` / `activity_sheets` access
-- model: RLS scopes rows to the owner; owners (admins) can read all.
--
-- Reuses the `generation_status` / `review_status` enums from 0001.
-- ============================================================================

create table if not exists public.assessments (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,

  title             text not null,
  subject           text not null default 'Biology',
  exam_board        text not null,           -- qualification label
  course_level      text not null,           -- year group
  topic             text not null,
  assessment_type   text not null,
  difficulty        text not null,
  question_count    integer not null default 10,

  content           jsonb,                    -- structured AssessmentContent
  model             text,
  generation_status generation_status not null default 'pending',
  review_status     review_status not null default 'draft',

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists assessments_user_created_idx
  on public.assessments (user_id, created_at desc);

-- Row Level Security ---------------------------------------------------------
alter table public.assessments enable row level security;

create policy "assessments_select_own" on public.assessments
  for select using (auth.uid() = user_id or public.is_owner());
create policy "assessments_insert_own" on public.assessments
  for insert with check (auth.uid() = user_id);
create policy "assessments_update_own" on public.assessments
  for update using (auth.uid() = user_id or public.is_owner());
create policy "assessments_delete_own" on public.assessments
  for delete using (auth.uid() = user_id);
