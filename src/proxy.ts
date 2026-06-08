import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/proxy';

// Next.js 16 renamed the `middleware` convention to `proxy` (same behaviour).
// Restored for Firebase App Hosting, which runs the full Node.js runtime and
// supports Next middleware (the Cloudflare/OpenNext adapter did not).
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on all routes except static assets and image optimisation files.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
