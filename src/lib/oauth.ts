/**
 * OAuth helpers for Clerk sign-in (Google / Microsoft).
 *
 * Pure and framework-free so they can be unit-tested in Node and reused by the
 * browser sign-in UI. Provider client secrets and scopes are configured in the
 * Clerk dashboard, not here. Nothing here logs codes/tokens.
 */

export type OAuthProvider = 'google' | 'microsoft';

/** Clerk OAuth strategy id for each provider button. */
export const OAUTH_STRATEGY: Record<OAuthProvider, 'oauth_google' | 'oauth_microsoft'> = {
  google: 'oauth_google',
  microsoft: 'oauth_microsoft',
};

/** Human label for each provider button. */
export const OAUTH_LABELS: Record<OAuthProvider, string> = {
  google: 'Continue with Google',
  microsoft: 'Continue with Microsoft',
};

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
 * resolves to a different origin. Used to sanitise the post-OAuth destination.
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
