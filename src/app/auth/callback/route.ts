import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeNextPath } from '@/lib/oauth';

/**
 * Handles the redirect back from Supabase auth flows — OAuth (Google/Microsoft)
 * and the email links (confirm signup / reset password). Exchanges the one-time
 * code for a session (stored via the existing SSR cookie client), then forwards
 * the user to a SAFE internal `next` path.
 *
 * Security:
 *   - `next` is sanitised with `safeNextPath` (rejects absolute, protocol-
 *     relative and external destinations) — no open redirects.
 *   - The redirect base is this request's own `origin` (trusted).
 *   - The authorization `code` and any tokens are NEVER logged.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNextPath(searchParams.get('next'));

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
