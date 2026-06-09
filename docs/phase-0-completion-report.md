# Phase 0 — Completion Report

Branch: `phase-0-foundations` (from `main`). Foundations are additive and reversible; the
only schema change is the single permitted security migration `0004`, which is **created but
not applied to production**.

## Automated verification (this environment)

| Check | Command | Result |
| --- | --- | --- |
| Unit tests | `npm run test` | ✅ 30 passed / 8 files |
| Type check | `npm run typecheck` | ✅ pass |
| Lint | `npm run lint` | ✅ pass |
| Production build | `npm run build` | ✅ pass (no secrets required) |

## Security gate — profiles privilege-escalation (migration `0004`)

| Item | Status |
| --- | --- |
| Security migration **created** (`supabase/migrations/0004_profiles_role_guard.sql`) | ✅ Done |
| Migration **tested outside production** | ⏳ **PENDING** — no Supabase/Docker/psql in this environment; run the script below in an isolated dev/local Supabase |
| **Self-promotion attempt denied** | ⏳ PENDING (covered by the dev-run script below) |
| **Normal profile update preserved** (`full_name`, `school`) | ⏳ PENDING (covered below) |
| **Signup / profile creation preserved** | ⏳ PENDING (covered below) |
| **Production migration status** | 🚫 **NOT APPLIED** — requires explicit product-owner approval |

> The migration is SQL-reviewed and self-contained (idempotent `drop ... if exists` /
> `create or replace`). It must still be **executed and verified in an isolated dev
> environment** before any production apply. Do not run `supabase db push` against
> production without explicit approval.

### Dev-environment verification script

Run against an **isolated/local** Supabase after applying migrations `0001`–`0004`. Replace
`<TEACHER_UID>` with a real `auth.users` id that has a `teacher` profile. Run the
authenticated cases through the client/PostgREST as that user (so `auth.uid()` is set), not
as the postgres superuser.

```sql
-- 1. Teacher CANNOT self-promote (expect: ERROR 42501) ----------------------
update public.profiles set role = 'owner' where id = '<TEACHER_UID>';
--> expected: ERROR: profiles: changing protected fields (role, id, email) is not permitted

-- 2. Teacher CAN still update safe fields (expect: success) -----------------
update public.profiles set full_name = 'Updated Name', school = 'New School'
where id = '<TEACHER_UID>';
--> expected: UPDATE 1

-- 3. Owner / admin role management still works ------------------------------
--    via the service-role key or SQL editor (auth.uid() IS NULL), e.g.:
update public.profiles set role = 'owner' where id = '<TARGET_UID>';
--> expected: UPDATE 1 (privileged path permitted)

-- 4. Signup / profile creation still works ----------------------------------
--    Create a user via Supabase Auth; confirm handle_new_user inserts a row:
select id, email, role from public.profiles where id = '<NEW_SIGNUP_UID>';
--> expected: one row, role = 'teacher' (BEFORE UPDATE trigger does not affect INSERT)
```

## Foundations shipped

- **Domain layer** (`src/lib/domain/`): `SubjectId` (biology/chemistry/physics),
  `YearLevelId` (year_7–year_13), `QualificationStageId`, `ExamBoardId`, `Role` — stable
  lowercase IDs, separate label maps, `*FromLegacy` adapters. Four orthogonal dimensions; all
  three sciences + all seven years representable; no curriculum content.
- **`department_lead`**: type-only in `domain/roles`. NOT persisted, NOT assignable, NOT
  authorising (verified by `roles.test.ts` and `can.test.ts`). DB enum unchanged.
- **Authz** (`src/lib/authz/`): pure `can()` + server `requireCan()` wrapping the existing
  `requireProfile`/`requireOwner`.
- **Env validation** (`src/lib/env.ts`): public vs server-secret split; runtime-only,
  production-fail-safe assertions; no secrets at build; secrets never logged.
- **Feature flags** (`src/lib/flags/`): typed env flags, default disabled; per-(subject, year)
  rollout gate.
- **Errors** (`src/lib/errors.ts`) + root boundary (`src/app/error.tsx`, Next 16 `unstable_retry`).
- **CI** (`.github/workflows/ci.yml`): test → typecheck → lint → build, plus migration
  append-only check. **Vitest** added (dev-only).
- **Docs**: audit, baseline, architecture, deployment-environments, this report.

## What was deliberately NOT done

No user-visible change; no curriculum content/pages/fake data; no `config.ts`/`types.ts`/
`curriculum/*` edits; no role-enum or tenant migration; generation stays mock; existing
migrations `0001`–`0003` untouched.

## Rollback

Code-only → `git revert` the PR and redeploy on Vercel. Migration `0004` is forward-only
(revert via a follow-up migration dropping the trigger + function); owners are never locked out.
