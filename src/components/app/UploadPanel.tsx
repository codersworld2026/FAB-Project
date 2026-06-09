'use client';

import { useState } from 'react';
import { BottomSheet } from './BottomSheet';

/**
 * Upload source UI — dashed drop area with upload / cloud / link affordances.
 * File ingestion is NOT implemented yet, so tapping any option opens an honest
 * "coming soon" sheet rather than faking a successful upload.
 *
 * TODO(uploads): wire real file/URL ingestion (parse PPTX/PDF/DOCX → topic
 * context) behind a server route with file-type + size validation.
 */
export function UploadPanel() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-violet-200 bg-violet-50/40 px-4 py-6 text-center transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-800/40 dark:hover:border-violet-800"
      >
        <span className="flex items-center gap-3">
          {[<UploadIcon key="u" />, <CloudIcon key="c" />, <LinkIcon key="l" />].map((icon, i) => (
            <span
              key={i}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-200 bg-white text-violet-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-violet-300"
            >
              {icon}
            </span>
          ))}
        </span>
        <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Add a starting point</span>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Existing plan, presentation, worksheet, link or notes
        </span>
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Add a starting point">
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          Uploading files and links to base a lesson on is coming soon. For now,
          type your topic and any specific instructions and we&apos;ll build the
          lesson from those.
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-4 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 font-display text-sm font-bold text-white shadow-lg shadow-violet-500/25"
        >
          Got it
        </button>
      </BottomSheet>
    </>
  );
}

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 16V5m0 0l-4 4m4-4l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function CloudIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 18a4 4 0 0 1-.5-7.97A5 5 0 0 1 16 9.2 3.5 3.5 0 0 1 17 18H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10 13a4 4 0 0 0 5.66 0l2.34-2.34a4 4 0 1 0-5.66-5.66L11 6.34" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11a4 4 0 0 0-5.66 0L6 13.34a4 4 0 1 0 5.66 5.66L13 17.66" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
