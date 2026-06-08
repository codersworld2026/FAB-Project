-- ============================================================================
-- FAB Project — Initial schema
-- Lesson-pack generator for teachers. Biology MVP.
--
-- Run with the Supabase CLI (`supabase db push`) or paste into the Supabase
-- SQL editor. Designed for Postgres + Supabase Auth.
--
-- Data-protection note: we store ONLY teacher account data. No student
-- personal data is collected or stored anywhere in this schema.
-- ============================================================================

-- Helpful enums ---------------------------------------------------------------
do $$ begin
  create type user_role as enum ('teacher', 'owner');
exception when duplicate_object then null; end $$;

do $$ begin
  create type review_status as enum ('draft', 'needs_review', 'approved');
exception when duplicate_object then null; end $$;

do $$ begin
  create type generation_status as enum ('pending', 'generating', 'complete', 'failed');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- profiles: one row per teacher, linked to Supabase auth.users
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  full_name   text,
  school      text,
  role        user_role not null default 'teacher',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create a profile whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- packs: generated lesson resource packs. `content` (jsonb) is the source of
-- truth; PDF/PPTX are rendered on demand from it.
-- ----------------------------------------------------------------------------
create table if not exists public.packs (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles (id) on delete cascade,

  -- Form inputs (also shown in history)
  topic               text not null,
  subject             text not null default 'Biology',
  exam_board          text not null,
  course_level        text not null,
  ability_level       text not null,
  lesson_length       text,
  learning_objectives text,
  teacher_notes_input text,

  -- Generation
  content             jsonb,                 -- full structured pack
  model               text,
  generation_status   generation_status not null default 'pending',
  generation_error    text,

  -- Quality workflow
  review_status       review_status not null default 'draft',

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists packs_user_id_created_idx
  on public.packs (user_id, created_at desc);

-- ----------------------------------------------------------------------------
-- prompt_templates: editable AI instructions, stored in DB so the owner can
-- tune them without a code change. One row per prompt "stage".
-- ----------------------------------------------------------------------------
create table if not exists public.prompt_templates (
  key         text primary key,            -- e.g. 'main', 'lesson_plan', 'safety'
  label       text not null,
  description text,
  content     text not null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references public.profiles (id)
);

-- ----------------------------------------------------------------------------
-- app_settings: runtime-configurable values (trial limit, exam board, model…)
-- Overrides the defaults in src/lib/config.ts.
-- ----------------------------------------------------------------------------
create table if not exists public.app_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references public.profiles (id)
);

-- ----------------------------------------------------------------------------
-- subscriptions: one row per teacher; mirrors Stripe state.
-- ----------------------------------------------------------------------------
create table if not exists public.subscriptions (
  user_id                uuid primary key references public.profiles (id) on delete cascade,
  stripe_customer_id     text,
  stripe_subscription_id text,
  status                 text not null default 'free',  -- free|trialing|active|past_due|canceled
  price_id               text,
  current_period_end     timestamptz,
  updated_at             timestamptz not null default now()
);

create index if not exists subscriptions_customer_idx
  on public.subscriptions (stripe_customer_id);

-- ----------------------------------------------------------------------------
-- usage_logs: generation + export events, for usage tracking, cost monitoring,
-- and debugging failed generations.
-- ----------------------------------------------------------------------------
create table if not exists public.usage_logs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.profiles (id) on delete set null,
  pack_id       uuid references public.packs (id) on delete set null,
  event         text not null,              -- generation_started|generation_complete|generation_failed|export_pdf|export_pptx
  success       boolean not null default true,
  input_tokens  integer,
  output_tokens integer,
  cost_usd      numeric(10, 5),
  error         text,
  metadata      jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists usage_logs_user_created_idx
  on public.usage_logs (user_id, created_at desc);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles         enable row level security;
alter table public.packs            enable row level security;
alter table public.subscriptions    enable row level security;
alter table public.usage_logs       enable row level security;
alter table public.prompt_templates enable row level security;
alter table public.app_settings     enable row level security;

-- Helper: is the current user an owner/admin?
create or replace function public.is_owner()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

-- profiles: a user sees/updates only their own row; owners see all.
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_owner());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- packs: owner-of-pack full access; owners (admins) can read all.
create policy "packs_select_own" on public.packs
  for select using (auth.uid() = user_id or public.is_owner());
create policy "packs_insert_own" on public.packs
  for insert with check (auth.uid() = user_id);
create policy "packs_update_own" on public.packs
  for update using (auth.uid() = user_id or public.is_owner());
create policy "packs_delete_own" on public.packs
  for delete using (auth.uid() = user_id);

-- subscriptions: read your own; writes happen via service role (webhooks).
create policy "subscriptions_select_own" on public.subscriptions
  for select using (auth.uid() = user_id or public.is_owner());

-- usage_logs: read your own; owners read all. Writes via service role.
create policy "usage_logs_select_own" on public.usage_logs
  for select using (auth.uid() = user_id or public.is_owner());

-- prompt_templates: any authenticated user may read; only owners may write.
create policy "prompts_select_auth" on public.prompt_templates
  for select using (auth.role() = 'authenticated');
create policy "prompts_write_owner" on public.prompt_templates
  for all using (public.is_owner()) with check (public.is_owner());

-- app_settings: any authenticated user may read; only owners may write.
create policy "settings_select_auth" on public.app_settings
  for select using (auth.role() = 'authenticated');
create policy "settings_write_owner" on public.app_settings
  for all using (public.is_owner()) with check (public.is_owner());
