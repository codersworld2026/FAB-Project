# FAB Architecture

## Today (Phase 0)

FAB is a Next.js 16 modular monolith on Supabase. Business logic lives in `src/lib/*`;
UI in `src/app/*` and `src/components/*`. See
[phase-0-current-system-audit.md](./phase-0-current-system-audit.md) for the full audit.

Phase 0 added a foundational **domain layer** and a few cross-cutting modules without
moving or rewriting any working code:

| Module | Path | Responsibility |
| --- | --- | --- |
| domain | `src/lib/domain/` | Canonical IDs for subject, year level, qualification stage, exam board, role |
| authz | `src/lib/authz/` | `can()` (pure) + `requireCan()` wrapping the existing `auth.ts` guards |
| flags | `src/lib/flags/` | Typed env feature flags, default disabled |
| env | `src/lib/env.ts` | Public vs server-secret access + runtime validation |
| errors | `src/lib/errors.ts` | Shared `AppError` vocabulary (+ root `src/app/error.tsx`) |

### The four curriculum dimensions are orthogonal

Subject, **year level**, **qualification stage/route**, and **exam board** are modelled as
**separate** concepts (`src/lib/domain/`). They must never be conflated:

- **Subject** — `biology | chemistry | physics` (stable lowercase IDs; labels separate).
- **Year level** — `year_7 … year_13` (KS3 = 7–9, KS4 = 10–11, KS5 = 12–13).
- **Qualification stage** — `ks3 | gcse | igcse | a_level`. KS3 requires **no** exam board.
- **Exam board** — `edexcel | aqa | ocr`, **optional** (null for KS3).

Existing free-text data (title-case, sometimes overloaded) is bridged by `*FromLegacy`
adapters — **no data migration**. All three sciences and all seven years are representable
now; curriculum *content* is added later, gated by feature flags for the year-by-year rollout.

## Target (later phases): modular monolith

Same repo, clearer module boundaries introduced incrementally. The shared `domain` layer is
the only thing every module depends on.

| Module | Depends on | Must NOT depend on |
| --- | --- | --- |
| domain | — | everything else |
| accounts/auth | domain | curriculum, generation, export, billing |
| organisations *(later)* | domain | generation, export, billing |
| curriculum | domain | generation, export, billing, accounts |
| resources | domain, accounts | generation/export internals |
| generation | domain, curriculum (read), prompts | export, billing, accounts internals |
| exports | domain | billing, generation internals, accounts |
| billing | domain, accounts | curriculum, generation, export internals |
| usage/analytics | domain, accounts | export internals |
| notifications *(later)* | domain | curriculum, generation |

### Decoupling rules (invariants)

- Prompt changes must not break login.
- Curriculum changes must not break exports.
- Export changes must not affect billing.
- Billing failures must not corrupt resources.
- Failed generation must not damage user accounts.

## Security: RLS is the real boundary

Row Level Security enforces tenant isolation; server guards (`auth.ts`, `authz/`) express
intent and add defence in depth. Migration `0004` closes the profiles privilege-escalation
gap (protected fields `role`/`id`/`email` are trigger-guarded). See the audit + completion
report for detail.
