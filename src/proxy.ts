import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Next.js 16 renamed the `middleware` convention to `proxy` (same behaviour).
// Clerk's middleware is exported as the file's default function and runs on
// proxy's default Node.js runtime.
//
// We keep the app's own /login page rather than Clerk's hosted UI, so instead
// of `auth.protect()` we redirect unauthenticated users to /login?redirect=…
// (matches the previous Supabase behaviour).
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/admin(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    /*
     * Run on all routes except static assets and image optimisation files.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
