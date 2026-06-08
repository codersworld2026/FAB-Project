'use client';

import { useEffect, useState } from 'react';
import { downloadLessonExport } from './exportClient';

/**
 * Compact "Download PDF" action for dashboard lesson cards/rows.
 * Uses sensible default options; full options live on the lesson detail page.
 */
export function QuickExportButton({ packId, title }: { packId: string; title: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 4000);
    return () => clearTimeout(t);
  }, [error]);

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setBusy(true);
    try {
      await downloadLessonExport('pdf', packId, title, {
        fullLessonPlan: true,
        includeTeacherNotes: true,
        includeHomework: true,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        aria-label={`Download ${title} as PDF`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:border-violet-300 hover:text-violet-700 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-violet-600 dark:hover:text-violet-300"
      >
        {busy ? (
          <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : (
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 4v10m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
        {busy ? 'PDF…' : 'PDF'}
      </button>

      {error && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg sm:left-auto sm:right-6 sm:mx-0"
        >
          {error}
        </div>
      )}
    </>
  );
}
