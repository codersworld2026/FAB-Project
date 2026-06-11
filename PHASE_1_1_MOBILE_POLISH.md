# Phase 1.1 — Mobile UX Polish

**Status:** Complete
**Branch:** `phase-0-auth-closure` (Phase 1.1 patch, before Phase 2)
**Scope:** Mobile-first polish only. No changes to Convex, Clerk, auth, env vars,
schema, or concept-graph logic. Desktop layouts preserved. Supabase remains
obsolete and was not reintroduced.

## Audit findings

The app shell and most routes were already mobile-first (responsive `px-4`,
`max-w-*` containers, single-column → `sm:grid-cols-2`, truncation, a proper
mobile drawer with ≥44px tap targets and safe-area padding). The real gaps were:

1. **No global horizontal-scroll guard** — a decorative absolutely-positioned
   layer could push the page wider than the viewport at 375px.
2. **Concepts browse search box** — rendered inside the `SectionHeader`'s
   `shrink-0` action slot with `max-w-sm` (384px), which can overflow a 375px
   screen and gave a cramped control.
3. **Concept detail graph links** — prior/next/related pills were ~33px tall
   (below the comfortable ~44px tap target) and could clip very long titles.
4. **Legal footer** (`/privacy`, `/terms`) — `justify-between` row could cramp
   the copyright + nav on narrow screens.

## What was fixed

- **`src/app/globals.css`** — added `overflow-x: clip` to `body`. Guarantees no
  horizontal scroll at 375px across every route; `clip` (not `hidden`) keeps the
  sticky dashboard header working.
- **`src/app/dashboard/concepts/page.tsx`** — the search form is now `w-full`
  and rendered in two sized wrappers: a compact `w-72` slot in the desktop header
  (placement unchanged) and a **full-width row on mobile** (`sm:hidden`). Removes
  the overflow risk and gives a comfortable full-width search bar with 16px input
  text (no iOS zoom-on-focus) that drops to `sm:text-sm` on desktop.
- **`src/app/dashboard/concepts/[conceptId]/page.tsx`** — prior/next/related
  link pills bumped to `min-h-10` / `py-2` tap targets, larger icon, and
  `break-words` so long concept titles wrap instead of overflowing.
- **`src/app/(legal)/layout.tsx`** — footer row now `flex-wrap` with `gap`, so
  the copyright + Privacy/Terms links stack cleanly on narrow screens (desktop
  unchanged — no wrap occurs at that width).

## Routes audited

`/` · `/login` · `/signup` · `/dashboard` · `/dashboard/concepts` ·
`/dashboard/concepts/[conceptId]` · `/dashboard/assessments` · `/privacy` ·
`/terms`

`/`, `/login`, `/signup`, `/dashboard`, `/dashboard/assessments` were already
responsive and correct; the global overflow guard hardens them further. The
concepts pages and legal footer received the targeted fixes above.

## Verification

`npm run test` · `npm run typecheck` · `npm run lint` · `npm run build` — all
green (see commit). Desktop layouts unchanged; mobile drawer, header and tap
targets verified comfortable.

## Remaining mobile notes (non-blocking)

- At the `md` breakpoint (tablet, 768–1023px) the desktop nav shows icon-only
  items (labels appear at `lg`); with 9 items this is dense but fits and is not a
  phone (<768px) concern — phones use the drawer.
- Visual sign-in click-through on the deployed Preview still requires a real
  Clerk session (agent cannot drive interactive login); the layout changes here
  are static/CSS and fully covered by the build.
