import 'server-only';
import { auth } from '@clerk/nextjs/server';

/**
 * The Convex auth token for the current Clerk session (minted from the "convex"
 * JWT template), or undefined when signed out. Pass it to `fetchQuery` /
 * `fetchMutation` so Convex functions see the authenticated identity. Shared by
 * the server-side data modules.
 */
export async function getConvexToken(): Promise<string | undefined> {
  const { getToken } = await auth();
  return (await getToken({ template: 'convex' })) ?? undefined;
}
