/**
 * Helpers for reading Clerk's API error shape without pulling in client-only
 * code. Clerk throws errors shaped like:
 *   { clerkError: true, errors: [{ code, message, longMessage }] }
 * Pure + framework-free so the auth forms (and tests) can share them.
 */
interface ClerkApiError {
  code?: string;
  message?: string;
  longMessage?: string;
}

function clerkErrors(err: unknown): ClerkApiError[] {
  if (typeof err === 'object' && err !== null && 'errors' in err) {
    const list = (err as { errors?: unknown }).errors;
    if (Array.isArray(list)) return list as ClerkApiError[];
  }
  return [];
}

/** A safe, user-facing message from a Clerk error, or the given fallback. */
export function clerkErrorMessage(err: unknown, fallback: string): string {
  const first = clerkErrors(err)[0];
  return first?.longMessage || first?.message || fallback;
}

/** True if the Clerk error carries the given error code. */
export function clerkHasErrorCode(err: unknown, code: string): boolean {
  return clerkErrors(err).some((e) => e.code === code);
}
