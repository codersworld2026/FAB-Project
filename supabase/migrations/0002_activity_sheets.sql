-- ============================================================================
-- FAB Project — Activity sheets (Phase 4)
--
-- Printable Biology activities (one per row). `content` (jsonb) holds the
-- structured sheet; the print/PDF view renders from it. Mirrors the `packs`
-- access model: RLS scopes rows to the owner; owners (admins) can read all.
--
-- Reuses the `generation_status` / `review_status` enums from 0001.
-- ============================================================================

create table if not exists public.activity_sheets (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,

  title             text not null,
  subject           text not null default 'Biology',
  exam_board        text not null,           -- qualification label
  course_level      text not null,           -- year group
  topic             text not null,
  activity_type     text not null,
  difficulty        text not null,

  content           jsonb,                    -- structured ActivitySheetContent
  model             text,
  generation_status generation_status not null default 'pending',
  review_status     review_status not null default 'draft',

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists activity_sheets_user_created_idx
  on public.activity_sheets (user_id, created_at desc);

-- Row Level Security ---------------------------------------------------------
alter table public.activity_sheets enable row level security;

create policy "activity_sheets_select_own" on public.activity_sheets
  for select using (auth.uid() = user_id or public.is_owner());
create policy "activity_sheets_insert_own" on public.activity_sheets
  for insert with check (auth.uid() = user_id);
create policy "activity_sheets_update_own" on public.activity_sheets
  for update using (auth.uid() = user_id or public.is_owner());
create policy "activity_sheets_delete_own" on public.activity_sheets
  for delete using (auth.uid() = user_id);
