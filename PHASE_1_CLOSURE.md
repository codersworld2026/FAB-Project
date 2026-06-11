# Phase 1 — Concept Graph Foundation

**Status:** ✅ Complete and verified in Vercel Preview
**Branch:** `phase-0-auth-closure`
**Key final commit:** `e7f3375` (`chore: backfill organisation membership during auth bootstrap`)
**Date closed:** 2026-06-11

---

## Summary

Phase 1 lays the scalable spine of FAB / Lessons Generator: a platform-authored
Science **concept graph**, multi-tenant from row one, on a **Convex (DB) + Clerk
(auth)** backend. It seeds one proof vertical per science, enforces authorization
in Convex function code (no RLS), and wires — but does not build — concept-anchored
generation. Existing UI and the generate→packs flow were left untouched. **Supabase
is obsolete and must not be treated as active.**

## What shipped

- **Convex-only backend path** — no Supabase in the new code; legacy Supabase
  modules are untouched and slated for later removal.
- **Clerk auth working** — Clerk identity → Convex (`profiles`) via the `convex`
  JWT template; signed-out protected routes redirect to `/login`.
- **Concept graph schema + resolvers** — `subjects`, `yearStages` (real
  `year-7…year-11`, phase + orderIndex), `topics`, `concepts` (rich fields +
  full-text search index), `conceptEdges` (locked A→B direction),
  `pedagogyStrategies` (stub), plus tenant `resources` / `usageEvents`. Read
  resolvers in `convex/curriculum.ts`; platform-admin writes in
  `convex/curriculumAdmin.ts`.
- **Science / Biology proof vertical** — idempotent seed
  (`convex/seed.ts` + `seedData.ts`): Biology (cells → organ systems),
  Chemistry (particles → mixtures), Physics (forces → acceleration). Live data:
  3 subjects / 5 year stages / 3 topics / 14 concepts / 28 edges.
- **Year → topic → concept browse flow** — `/dashboard/concepts` (searchParams
  drill-down `?subject=&stage=&topic=` + minimal GET search), ordered by
  `orderIndex`, reusing existing UI components.
- **Concept detail page** — `/dashboard/concepts/[conceptId]`: explanation,
  vocabulary, misconceptions, lesson/assessment guidance, practical links.
- **prior / next / related links** — graph reads with canonical direction
  (`getPriorTreatment` / `getNextTreatment` / `getRelatedConcepts`), rendered as
  linkable concepts on the detail page.
- **Empty resources state** — concepts with no tenant resources show
  "Resources will appear here once concept-anchored generation is wired in a
  later phase."
- **Org-scoped authz + tenant isolation** — every org-scoped function resolves
  identity → profile → membership; a client-supplied `organizationId` is always
  membership-checked, never trusted; curriculum writes require
  `is_platform_admin === true` (org-owner does not qualify).
- **Self-healing profile / org membership bootstrap** — `profiles.ensureProfile`
  idempotently creates a personal org + owner membership; auth bootstrap
  (`src/lib/auth.ts`) now **always** runs it, healing users whose profile
  predated the orgs tables (fixed the signed-in `/dashboard/concepts` crash).

## Verification results (2026-06-11)

| Check | Result |
|---|---|
| `npm run test` | ✅ 62 passed (13 files), incl. authz/tenancy tests A–G |
| `npm run typecheck` | ✅ clean |
| `npm run lint` | ✅ 0 errors (5 pre-existing warnings) |
| `npm run build` | ✅ success |
| Vercel Preview (`phase-0-auth-closure`) | ✅ READY, real-auth mode |

**Manually verified in Vercel Preview:** signed-out protected routes redirect to
login; signed-in `/dashboard/concepts` works; Biology → Year 7 → concept detail
flow works; seeded data present.

**Convex-test coverage (`convex/authz.test.ts`):**
A org isolation · B non-admin curriculum write rejected · C existing-profile
backfill idempotent · D client-provided org id rejected · E seed idempotency ·
F edge direction locked · G membership backfill unblocks curriculum reads.

## Known notes / warnings

- **Production is NOT updated.** `main` is still the old pre-Phase-1 (Supabase-era)
  code and must **not** be treated as Phase 1 production. Phase 1 lives only on
  `phase-0-auth-closure` and is verified on **Vercel Preview**, not production.
- Seeded curriculum data currently lives in the **dev** Convex deployment
  (`spotted-ptarmigan-641`). A production rollout needs a seeded prod Convex
  deployment + Production-scope env vars.
- 5 pre-existing lint warnings remain (Convex generated files + an anonymous
  default export in `auth.config.ts`) — not introduced by Phase 1.

## Next phase

Phase 2 should start from this verified base (`phase-0-auth-closure` @ `e7f3375`).
Production promotion (merge to `main`, Production env vars, seeded prod Convex)
and concept-anchored generation are explicitly out of scope for Phase 1.
