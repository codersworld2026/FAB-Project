/**
 * Resolve the public base URL of the CURRENT deployment for building absolute
 * links in emails (signup confirmation, password recovery). These links MUST
 * point back to the same deployment the user is on — localhost, a Vercel
 * Preview (a unique host per deployment) or production — so they are resolved
 * at request time, never from a single build-time constant.
 *
 * Resolution order (first match wins):
 *   1. x-forwarded-proto + x-forwarded-host   (set by Vercel's edge/proxy)
 *   2. host                                    (+ inferred proto)
 *   3. origin                                  (full origin of the page)
 *   4. https://$VERCEL_BRANCH_URL              (stable per-branch Preview alias)
 *   5. https://$VERCEL_URL                     (unique per-deployment URL)
 *   6. NEXT_PUBLIC_APP_URL                     (configured canonical URL)
 *   7. http://localhost:3000                   (LOCAL DEVELOPMENT ONLY)
 *
 * HARD RULE: a Vercel Preview or Production runtime must NEVER emit a localhost
 * link. `VERCEL_URL` is always set there, so steps 4/5 always resolve; the
 * localhost literal (step 7) is gated to non-Vercel environments, and if a
 * Vercel runtime somehow has no host signal at all we throw rather than fall
 * back to localhost.
 *
 * Trust note: forwarded headers are only as trustworthy as the proxy in front
 * of the app (on Vercel, the trusted edge). Even if spoofed, the URL is only
 * handed to Supabase, which independently rejects any redirect not on its
 * allow-list — so this cannot create an open redirect. No tokens/codes are read
 * or logged here.
 */

const LOCAL_FALLBACK = 'http://localhost:3000';

type HeaderGetter = (name: string) => string | null | undefined;

/** The subset of environment variables this resolver consults. */
export interface BaseUrlEnv {
  VERCEL_ENV?: string;
  VERCEL_BRANCH_URL?: string;
  VERCEL_URL?: string;
  NEXT_PUBLIC_APP_URL?: string;
}

/** Take the first entry of a possibly comma-joined header value. */
function firstValue(value: string | null | undefined): string | null {
  if (!value) return null;
  const first = value.split(',')[0]?.trim();
  return first ? first : null;
}

function isLocalHost(host: string): boolean {
  return /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i.test(host);
}

function isLocalUrl(url: string): boolean {
  try {
    return isLocalHost(new URL(url).host);
  } catch {
    return /localhost|127\.0\.0\.1/i.test(url);
  }
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

/** True on a deployed Vercel Preview or Production runtime. */
function isVercelDeployment(env: BaseUrlEnv): boolean {
  return env.VERCEL_ENV === 'preview' || env.VERCEL_ENV === 'production';
}

/** Steps 1–3: derive the origin from the live request headers, or null. */
function fromHeaders(get: HeaderGetter): string | null {
  const forwardedHost = firstValue(get('x-forwarded-host'));
  if (forwardedHost) {
    const proto =
      firstValue(get('x-forwarded-proto')) ??
      (isLocalHost(forwardedHost) ? 'http' : 'https');
    return `${proto}://${forwardedHost}`;
  }

  const host = firstValue(get('host'));
  if (host) {
    return `${isLocalHost(host) ? 'http' : 'https'}://${host}`;
  }

  const origin = firstValue(get('origin'));
  if (origin && /^https?:\/\//i.test(origin)) return origin;

  return null;
}

/**
 * Pure, synchronous core (unit-testable): resolve the base URL from a header
 * accessor + an environment snapshot, following the order documented above.
 */
export function resolveBaseUrl(get: HeaderGetter, env: BaseUrlEnv): string {
  // 1–3: trust the live request headers first.
  const fromRequest = fromHeaders(get);
  if (fromRequest) return stripTrailingSlash(fromRequest);

  // 4: stable per-branch Preview alias.
  if (env.VERCEL_BRANCH_URL) {
    return stripTrailingSlash(`https://${env.VERCEL_BRANCH_URL}`);
  }

  // 5: unique per-deployment URL (always present on a Vercel runtime).
  if (env.VERCEL_URL) {
    return stripTrailingSlash(`https://${env.VERCEL_URL}`);
  }

  // 6: configured canonical URL — but never a localhost value while on Vercel.
  if (
    env.NEXT_PUBLIC_APP_URL &&
    !(isVercelDeployment(env) && isLocalUrl(env.NEXT_PUBLIC_APP_URL))
  ) {
    return stripTrailingSlash(env.NEXT_PUBLIC_APP_URL);
  }

  // 7: localhost — LOCAL DEVELOPMENT ONLY. A Preview/Production runtime must
  // never email a localhost link; steps 4/5 make this unreachable there.
  if (isVercelDeployment(env)) {
    throw new Error(
      'Could not resolve a non-localhost base URL on a Vercel runtime ' +
        '(no host headers, VERCEL_BRANCH_URL or VERCEL_URL available).',
    );
  }
  return LOCAL_FALLBACK;
}

/**
 * Async wrapper for server code (Server Actions, Route Handlers). Reads the
 * live request headers and the current environment. `next/headers` is imported
 * dynamically so the pure resolver above stays loadable in plain unit tests.
 */
export async function getRequestBaseUrl(): Promise<string> {
  const { headers } = await import('next/headers');
  const headerList = await headers();
  return resolveBaseUrl((name) => headerList.get(name), {
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  });
}
