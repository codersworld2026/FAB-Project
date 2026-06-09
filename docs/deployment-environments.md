# Deployment & Environments

## Hosting

FAB deploys to **Vercel**. The repository is linked to a Vercel project via the gitignored
`.vercel/` directory (internal project/team identifiers are intentionally not reproduced
here). The Firebase App Hosting comment in `src/proxy.ts` is historical and does not reflect
the active target; the `pptxgenjs` bundling in `next.config.ts` is a Vercel-specific fix.

Flow: feature branch → PR (CI runs) → Vercel **preview** deploy → promote to `main`.

## Environment variable classes

Two classes, kept strictly separate. **Secrets are never logged** — code exposes presence
booleans, not values (`serverSecretPresence()` in `src/lib/env.ts`).

### Public (browser-safe, inlined at build)
`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`, `NEXT_PUBLIC_SUPPORT_EMAIL`,
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_DEFAULT_EXAM_BOARD`,
`NEXT_PUBLIC_REFERRAL_ENABLED`.

### Server-only secrets (never sent to the browser, read only when used)
`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`.

## When validation runs

Defined in `src/lib/env.ts`:

1. **Build time (CI + Vercel preview/prod builds): no secrets required.** Validation does
   **not** run at import / module-eval / static compilation, so `next build` always succeeds
   without production secrets.
2. **Production runtime:** before any auth/DB-dependent request,
   `assertSupabaseConfiguredInProduction()` is called. If the Supabase configuration is
   missing in production it **throws** — production must **never** fall back to the
   owner-preview experience (`src/lib/preview.ts`). Outside production, the graceful preview
   path remains.
3. **Feature secrets** (Anthropic, Stripe) are required **only when that feature executes**,
   via `requireServerSecret(name)`, which throws naming the variable but never its value.

This behaviour is covered by unit tests (`src/lib/__tests__/env.test.ts`) — the tests assert
the **runtime** behaviour, not that a build fails.

## CI

`.github/workflows/ci.yml` runs on PRs and pushes to `main`, with **no production secrets**:

```
npm ci → npm run test → npm run typecheck → npm run lint → npm run build
```

plus a **security-gate** step on PRs asserting that applied migrations (`0001`–`0003`) are
never modified (append-only). The DB-level role-guard verification for migration `0004` runs
in an isolated dev environment (CI has no Supabase database) — see the completion report.

## Rollback

- App/foundations: code-only → `git revert` the PR and redeploy.
- Migration `0004`: forward-only; revert via a follow-up migration dropping the trigger +
  function. Owners are never locked out (service-role admin client or SQL editor can still
  set roles).
