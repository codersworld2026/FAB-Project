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
 *   - A provider `error` / `error_description` is handled but NEVER logged, and
 *     the description (which can echo attacker input) is never reflected.
 *   - The authorization `code` and any tokens are NEVER logged.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNextPath(searchParams.get('next'));
  const providerError = searchParams.get('error');

  // Recovery failures get a contextual destination so the reset page can show
  // "link expired" rather than dumping the user on a generic login error.
  const isRecovery = next === '/reset-password';
  const failureRedirect = isRecovery
    ? `${origin}/reset-password?error=expired`
    : `${origin}/login?error=auth`;

  // The provider returned an error (e.g. the user cancelled consent). Do not log
  // or reflect `error_description`.
  if (providerError) {
    return NextResponse.redirect(failureRedirect);
  }

  if (!code) {
    return NextResponse.redirect(failureRedirect);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(failureRedirect);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
