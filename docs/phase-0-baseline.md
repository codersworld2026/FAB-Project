# Phase 0 — Baseline

Recorded **before** Phase 0 changes, on branch `phase-0-foundations` (from `main`),
to prove the starting point was green and that Phase 0 introduced no regressions.

## Pre-change baseline (clean `main` tree)

| Check | Command | Result |
| --- | --- | --- |
| Type check | `npm run typecheck` | ✅ pass (exit 0) |
| Lint | `npm run lint` | ✅ pass (exit 0) |
| Production build | `npm run build` | ✅ pass — 25 routes compiled, Proxy (Middleware) active |

The build succeeds **without any Supabase/Anthropic/Stripe secrets**, confirming the
app's graceful "not configured" path. (Phase 0 hardens this so that *production*
no longer degrades silently — see [deployment-environments.md](./deployment-environments.md).)

## Post-change verification (after Phase 0 foundations)

| Check | Command | Result |
| --- | --- | --- |
| Unit tests | `npm run test` | ✅ 30 passed across 8 files |
| Type check | `npm run typecheck` | ✅ pass |
| Lint | `npm run lint` | ✅ pass |
| Production build | `npm run build` | ✅ pass (no secrets required) |

## Tooling added

- **Vitest** `^4.1.8` (dev dependency only) + `"test": "vitest run"` script.
- `package.json` and `package-lock.json` updated; **no production dependencies changed**.
