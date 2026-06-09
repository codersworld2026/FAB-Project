# Phase 0 — Current System Audit

A read-only audit of FAB as it stood at the start of Phase 0. No behaviour was
changed by this document.

## Technology stack

| Concern | Finding |
| --- | --- |
| Framework | Next.js **16.2.7** (App Router; Server Components + Server Actions; `middleware` → `proxy`) |
| UI | React **19.2.4** |
| Language | TypeScript ^5, `strict: true`, alias `@/* → src/*` |
| Package manager | npm (`package-lock.json`) |
| Auth | Supabase Auth via `@supabase/ssr` (cookie sessions) |
| Database | Supabase Postgres + Row Level Security |
| AI | Anthropic SDK installed; generation is currently a **mock** (`src/lib/generation/index.ts`) |
| PDF export | `@react-pdf/renderer` (kept external in `next.config.ts`) |
| PPTX export | `pptxgenjs` (bundled in `next.config.ts`) |
| Billing | Stripe SDK + `subscriptions` table — **not yet implemented** |
| Validation | Zod ^4 |
| Styling | Tailwind v4 (light/dark themes) |
| Hosting | Vercel (see [deployment-environments.md](./deployment-environments.md)) |
| Tests / CI | **None** prior to Phase 0 |

## Architecture

- Mutations via Server Actions (`src/app/**/actions.ts`); binary exports via Route
  Handlers (`src/app/api/export/{pdf,pptx}/route.ts`).
- Auth: `src/proxy.ts` refreshes the Supabase session and guards `/dashboard` + `/admin`;
  `requireProfile()` / `requireOwner()` in `src/lib/auth.ts` enforce access server-side; a
  `handle_new_user` trigger auto-creates a `profiles` row at signup.
- Generation behind a stable `PackGenerator` interface (`src/lib/generation/`); subject is
  injected server-side as `APP_CONFIG.subject` ("locked to Biology").
- Prompts in DB `prompt_templates` with in-code defaults (`src/lib/prompts.ts`).
- Exports render from the structured `*Content` JSON (`src/lib/export/`).
- Single `APP_CONFIG` (`src/lib/config.ts`) with runtime overrides via `app_settings`
  (`src/lib/settings.ts`, an async DB read).
- Preview mode: when Supabase env is absent, protected pages render sample data **as an
  owner** without auth (`src/lib/preview.ts`).

## Data model

Tables (RLS on all): `profiles`, `packs`, `activity_sheets`, `assessments`,
`prompt_templates`, `app_settings`, `subscriptions`, `usage_logs`.

Resource tables store `subject`, `exam_board`, `course_level`, `topic` as **free-text** —
so they can hold any future value with **no migration**. However, the columns are
**overloaded across tables**, which is why the Phase 0 domain layer separates the
concepts (see [architecture.md](./architecture.md)):

| Column | In `packs` | In `activity_sheets` / `assessments` |
| --- | --- | --- |
| `course_level` | qualification stage (`GCSE` / `International GCSE`) | year group (`Year 10`) |
| `exam_board` | board (`Pearson Edexcel`) | qualification label (`Edexcel GCSE Biology`) |

## RLS audit

**Sound:** all resource tables enforce `select` (own or owner), `insert`
(`auth.uid() = user_id`), `update` (own or owner), `delete` (own); `subscriptions` and
`usage_logs` are select-only under RLS (writes via service role); `prompt_templates` /
`app_settings` are read-authenticated / write-owner; `is_owner()` is `security definer stable`.

**Finding (now fixed by migration `0004`):** the original `profiles_update_own` policy was
`for update using (auth.uid() = id)` with **no `WITH CHECK` and no column protection**, so an
authenticated user could `update profiles set role='owner'` and self-promote. There were
**zero** profile-update flows in app code, so the guard added in Phase 0 (a `BEFORE UPDATE`
trigger protecting `role`/`id`/`email`, plus a `WITH CHECK`) breaks nothing legitimate. See
[phase-0-completion-report.md](./phase-0-completion-report.md).

## Risks carried forward (not in Phase 0 scope)

- No rate limiting on generation/export (cost/abuse vector once real AI lands).
- Trial metering counts only `packs` — activity sheets/assessments are gated but unmetered.
- No `organisation_id` tenant boundary yet.
- AI output not yet validated against `PackContent` (matters when Anthropic is wired).
