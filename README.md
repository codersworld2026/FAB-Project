# Lesson Pack Generator

An MVP web app that generates original, exam-style **Biology** lesson resource
packs for teachers — lesson plan, slides, three differentiated worksheets,
assessment, mark scheme and teacher notes — downloadable as **PDF** and
**PowerPoint**. Teacher login, free trial, then a paid subscription.

> **Scope (MVP):** Biology only · one exam board (Edexcel by default) · lesson
> packs only. Deliberately narrow. No student personal data is ever collected.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database + Auth | Supabase (Postgres + Auth) |
| AI | Anthropic Claude (`@anthropic-ai/sdk`) |
| PDF export | `@react-pdf/renderer` |
| PowerPoint export | `pptxgenjs` |
| Payments | Stripe (Checkout + Customer Portal + webhooks) |
| Hosting | Vercel (recommended) |

## Project status

Built so far (Milestone 2 — Foundation):

- Teacher auth: sign up, login, logout, password reset (Supabase)
- Database schema + Row Level Security (see `supabase/migrations/`)
- Teacher dashboard shell, account page, routing/layout
- Configurable settings layer (trial limit, exam board) — `src/lib/config.ts`
  with DB overrides in `app_settings`
- DB-stored, editable prompt templates (`prompt_templates`) seeded with starters

Coming next: lesson generator form + AI generation (M3), full pack structure
(M4), PDF/PPTX export (M5), Stripe paywall (M6), admin/prompt editor (M7),
hardening + deployment (M8).

## Local setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a Supabase project** (customer-owned) at https://supabase.com.
   From **Settings → API**, copy the project URL, the `anon` key, and the
   `service_role` key.

3. **Apply the database schema.** In the Supabase SQL editor, run, in order:
   - `supabase/migrations/0001_initial_schema.sql`
   - `supabase/seed.sql` (default prompts + settings)

   (Or use the Supabase CLI: `supabase db push`.)

4. **Configure environment variables.** Copy `.env.example` to `.env.local`
   and fill in the values:
   ```bash
   cp .env.example .env.local
   ```
   The app boots without keys (showing a "not configured" notice), but auth and
   generation need Supabase + Anthropic set.

5. **Run the dev server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000.

### Making yourself the owner/admin

After signing up, promote your account in the Supabase SQL editor:
```sql
update public.profiles set role = 'owner' where email = 'you@example.com';
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check (no emit)

## Environment variables

See `.env.example` for the full annotated list. Summary:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY` — database + auth
- `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL` — AI generation
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
  `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID` — payments (added in M6)
- `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_APP_NAME`,
  `NEXT_PUBLIC_SUPPORT_EMAIL` — app config
- `FREE_TRIAL_PACK_LIMIT`, `NEXT_PUBLIC_DEFAULT_EXAM_BOARD` — business defaults

## Deployment (Vercel)

1. Push this repo to the customer-owned GitHub repository.
2. Import the repo into Vercel (customer-owned account).
3. Add every variable from `.env.example` in **Vercel → Project → Settings →
   Environment Variables** (set `NEXT_PUBLIC_APP_URL` to the production domain).
4. Point the customer's domain at the Vercel project.
5. Stripe webhook + AI key setup notes are expanded in the M6/M8 handover docs.

## Cost note

Each generated pack is a large Anthropic call, so it has a real per-pack cost.
The default model (`claude-sonnet-4-6`) balances quality and cost; switch to
`claude-opus-4-8` for top quality at higher cost. Token usage and cost per
generation are logged to `usage_logs` so the price can be set to cover it.

## Ownership

All code, accounts, and the domain belong to the customer. The developer has
access only. See the customer's go-live plan and kickoff documents.
