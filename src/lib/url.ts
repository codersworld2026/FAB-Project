/**
 * Derive the public base URL of the CURRENT deployment from request headers.
 *
 * Why this exists: email links (signup confirmation, password recovery) must
 * point back to the SAME deployment the user is on — localhost, a Vercel
 * Preview (whose host is unique per deployment) or production. Building those
 * links from a single build-time `NEXT_PUBLIC_APP_URL` cannot satisfy all three
 * at once, so we read the host from the incoming request instead. (The browser
 * OAuth flow already does the equivalent via `window.location.origin`.)
 *
 * Trust note: `x-forwarded-host` is only as trustworthy as the proxy in front
 * of the app — on Vercel it is set by the trusted edge. Even if it were spoofed,
 * the resulting URL is only ever handed to Supabase, which independently rejects
 * any redirect that is not on its allow-list, so this cannot create an open
 * redirect. No tokens or codes are read or logged here.
 */
import { publicEnv } from '@/lib/env';

const LOCAL_FALLBACK = 'http://localhost:3000';

/** Take the first entry of a possibly comma-joined header value. */
function firstValue(value: string | null | undefined): string | null {
  if (!value) return null;
  const first = value.split(',')[0]?.trim();
  return first ? first : null;
}

function isLocalHost(host: string): boolean {
  return /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(host);
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

/**
 * Pure, synchronous core (unit-testable): resolve the base URL from a header
 * accessor. Priority, most → least trustworthy for a proxied deployment:
 *   1. x-forwarded-host (+ x-forwarded-proto) — set by Vercel's edge/proxy.
 *   2. origin — the exact origin of the page that issued the request.
 *   3. host — https assumed unless the host is explicitly local.
 *   4. fallback (configured app URL, else localhost).
 */
export function baseUrlFromHeaders(
  get: (name: string) => string | null | undefined,
  fallback: string = publicEnv.appUrl || LOCAL_FALLBACK,
): string {
  const forwardedHost = firstValue(get('x-forwarded-host'));
  if (forwardedHost) {
    const proto =
      firstValue(get('x-forwarded-proto')) ??
      (isLocalHost(forwardedHost) ? 'http' : 'https');
    return stripTrailingSlash(`${proto}://${forwardedHost}`);
  }

  const origin = firstValue(get('origin'));
  if (origin && /^https?:\/\//i.test(origin)) {
    return stripTrailingSlash(origin);
  }

  const host = firstValue(get('host'));
  if (host) {
    const proto = isLocalHost(host) ? 'http' : 'https';
    return stripTrailingSlash(`${proto}://${host}`);
  }

  return stripTrailingSlash(fallback || LOCAL_FALLBACK);
}

/**
 * Async wrapper for server code (Server Actions, Route Handlers). Reads the
 * live request headers. `next/headers` is imported dynamically so the pure
 * helper above stays loadable in plain unit tests.
 */
export async function getRequestBaseUrl(): Promise<string> {
  const { headers } = await import('next/headers');
  const headerList = await headers();
  return baseUrlFromHeaders((name) => headerList.get(name));
}
