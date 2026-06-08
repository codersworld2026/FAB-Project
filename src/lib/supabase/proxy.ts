import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from './env';

/** Routes that require an authenticated teacher. */
const PROTECTED_PREFIXES = ['/dashboard', '/admin'];

/**
 * Refreshes the Supabase auth session on every request and guards protected
 * routes. If Supabase isn't configured yet, requests pass through untouched so
 * the app still boots before the customer adds their keys.
 *
 * NOTE: currently NOT wired. The Cloudflare/OpenNext adapter does not yet
 * support Next.js 16 Node-runtime middleware ("proxy"), so the root
 * `src/proxy.ts` was removed to allow the Cloudflare build. Route protection is
 * enforced at the page/layout level instead (`requireProfile`/`requireOwner`).
 * To restore middleware-based session refresh once the adapter supports it (or
 * when hosting on Vercel), recreate `src/proxy.ts`:
 *
 *   import { type NextRequest } from 'next/server';
 *   import { updateSession } from '@/lib/supabase/proxy';
 *   export async function proxy(request: NextRequest) { return updateSession(request); }
 *   export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
 */
export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
