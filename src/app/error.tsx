'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';

/**
 * Root error boundary. Catches unexpected runtime errors in the route tree and
 * renders a safe fallback. Errors thrown in Server Components arrive here with a
 * generic message + `digest` (production never leaks sensitive detail to the
 * client).
 *
 * Next.js 16 passes `unstable_retry` (added in v16.2.0) to re-render the segment.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Best-effort client log. Swap for a monitoring sink (e.g. Sentry) later.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        Something went wrong
      </h2>
      <p className="max-w-md text-sm text-zinc-500 dark:text-zinc-400">
        An unexpected error occurred. You can try again, or head back to your
        dashboard.
      </p>
      {error.digest ? (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          Reference: {error.digest}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => unstable_retry()}
        className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
      >
        Try again
      </button>
    </div>
  );
}
