/**
 * OAuth helpers for the existing Supabase Auth system.
 *
 * Pure and framework-free so they can be unit-tested in Node and reused by the
 * browser sign-in UI and the server callback route. No secrets live here —
 * provider client secrets stay only in Supabase. Nothing here logs codes/tokens.
 */

export type OAuthProvider = 'google' | 'azure';

/**
 * Requested scopes per provider — identity only.
 *   - google: standard OpenID Connect identity (NO Gmail/Drive/Calendar).
 *   - azure (Microsoft): OpenID identity with the email scope requested explicitly.
 */
export const OAUTH_SCOPES: Record<OAuthProvider, string> = {
  google: 'openid email profile',
  azure: 'openid profile email',
};

/** Human label for each provider button. */
export const OAUTH_LABELS: Record<OAuthProvider, string> = {
  google: 'Continue with Google',
  azure: 'Continue with Microsoft',
};

/**
 * Build the OAuth redirect-back URL from the CURRENT trusted origin (never a
 * hard-coded host), so it works on localhost, Vercel preview and production.
 * `next` is encoded; the callback re-validates it with `safeNextPath`.
 */
export function buildOAuthRedirectTo(origin: string, next = '/dashboard'): string {
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`;
}

/** Minimal structural shape of the Supabase client used here (keeps tests light). */
export interface OAuthCapableClient {
  auth: {
    signInWithOAuth(credentials: {
      provider: OAuthProvider;
      options?: { redirectTo?: string; scopes?: string };
    }): Promise<{ error: { message: string } | null }>;
  };
}

/**
 * Begin an OAuth sign-in through the existing Supabase browser client. On
 * success the browser is redirected to the provider (the caller should keep its
 * loading state until navigation). Returns `{ error }` so the UI can surface a
 * failure without any fake success.
 */
export async function startOAuth(
  supabase: OAuthCapableClient,
  provider: OAuthProvider,
  origin: string,
  next = '/dashboard',
): Promise<{ error: { message: string } | null }> {
  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: buildOAuthRedirectTo(origin, next),
      scopes: OAUTH_SCOPES[provider],
    },
  });
}

/** True if the string contains any C0 control char or DEL (header-injection guard). */
function hasControlChars(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code <= 0x1f || code === 0x7f) return true;
  }
  return false;
}

/**
 * Reduce an untrusted `next` value to a SAFE internal relative path, or
 * `/dashboard`. Prevents open redirects: rejects absolute URLs, protocol-
 * relative (`//host`), backslash tricks, control characters, and anything that
 * resolves to a different origin.
 */
export function safeNextPath(raw: string | null | undefined): string {
  const FALLBACK = '/dashboard';
  if (!raw) return FALLBACK;
  if (!raw.startsWith('/')) return FALLBACK; // must be path-absolute (internal)
  if (raw.startsWith('//')) return FALLBACK; // protocol-relative → external
  if (raw.includes('\\')) return FALLBACK; // browsers fold "\" to "/"
  if (hasControlChars(raw)) return FALLBACK; // header/redirect injection
  try {
    const url = new URL(raw, 'http://localhost');
    if (url.origin !== 'http://localhost') return FALLBACK; // resolved off-origin
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return FALLBACK;
  }
}
