'use client';

import { useState } from 'react';
import Link from 'next/link';
import { clsx } from '@/components/clsx';
import { ChevronLeftIcon } from '@/components/app/icons';
import type { ActivitySheet, ActivitySheetContent } from '@/lib/types';

type Mode = 'student' | 'teacher';

export function ActivitySheetView({
  sheet,
  content,
}: {
  sheet: ActivitySheet;
  content: ActivitySheetContent;
}) {
  const [mode, setMode] = useState<Mode>('student');

  const chips = [
    sheet.exam_board,
    sheet.course_level,
    sheet.activity_type,
    sheet.difficulty,
    `~${content.estimatedMinutes} min`,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="no-print">
        <Link href="/dashboard/activity-sheets" className="inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:underline dark:text-violet-300">
          <ChevronLeftIcon className="h-4 w-4" /> Back to activity sheets
        </Link>
      </div>

      {/* Header */}
      <div className="no-print overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{sheet.title}</h1>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <span key={c} className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900" role="tablist" aria-label="Version">
          {(['student', 'teacher'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={clsx(
                'min-h-10 rounded-lg px-4 text-sm font-semibold capitalize transition-colors',
                mode === m ? 'bg-violet-600 text-white shadow-sm' : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800',
              )}
            >
              {m} version
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-sm font-bold text-white shadow-sm shadow-violet-500/25 transition-transform hover:scale-[1.02]"
        >
          <PrintIcon /> Print {mode} version
        </button>
      </div>

      {/* On-screen sheet */}
      <div className="no-print rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{content.intro}</p>
        <ol className="mt-5 space-y-3">
          {content.items.map((item, i) => (
            <li key={i} className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    {item.prompt}
                    {item.marks ? <span className="text-zinc-400 dark:text-zinc-500"> ({item.marks} marks)</span> : null}
                  </p>
                  {mode === 'student' ? (
                    <div className="mt-2 h-10 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700" aria-hidden="true" />
                  ) : (
                    <p className="mt-2 rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-900 dark:bg-violet-950/40 dark:text-violet-100">
                      <span className="font-semibold">Answer:</span> {item.answer}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
        {mode === 'teacher' && content.teacherNotes ? (
          <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-inset ring-amber-100 dark:bg-amber-950/30 dark:text-amber-100 dark:ring-amber-900/60">
            <span className="font-semibold">Teacher notes:</span> {content.teacherNotes}
          </p>
        ) : null}
      </div>

      {/* Print-only block (reflects current mode) */}
      <PrintableSheet sheet={sheet} content={content} mode={mode} chips={chips} />
    </div>
  );
}

/** Hidden on screen; rendered when the user prints (global print CSS). */
function PrintableSheet({
  sheet,
  content,
  mode,
  chips,
}: {
  sheet: ActivitySheet;
  content: ActivitySheetContent;
  mode: Mode;
  chips: string[];
}) {
  return (
    <div className="printable hidden print:block" style={{ color: '#18181b' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{sheet.title}</h1>
      <p style={{ fontSize: '11px', color: '#52525b', marginTop: '4px' }}>
        {chips.join('  •  ')} — {mode === 'teacher' ? 'Teacher (answers)' : 'Student'} version
      </p>
      <p style={{ fontSize: '12px', marginTop: '12px' }}>{content.intro}</p>
      <ol style={{ marginTop: '12px', paddingLeft: '18px' }}>
        {content.items.map((item, i) => (
          <li key={i} style={{ marginBottom: mode === 'student' ? '22px' : '12px', fontSize: '12px' }}>
            <span style={{ fontWeight: 600 }}>{item.prompt}</span>
            {item.marks ? <span style={{ color: '#71717a' }}> ({item.marks} marks)</span> : null}
            {mode === 'teacher' ? (
              <div style={{ marginTop: '4px', color: '#6d28d9' }}>Answer: {item.answer}</div>
            ) : (
              <div style={{ borderBottom: '1px solid #d4d4d8', marginTop: '14px' }} />
            )}
          </li>
        ))}
      </ol>
      {mode === 'teacher' && content.teacherNotes ? (
        <p style={{ fontSize: '11px', marginTop: '12px', fontStyle: 'italic' }}>Teacher notes: {content.teacherNotes}</p>
      ) : null}
    </div>
  );
}

function PrintIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 9V4h10v5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M5 9h14a2 2 0 0 1 2 2v5h-4v4H7v-4H3v-5a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M7 16h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
