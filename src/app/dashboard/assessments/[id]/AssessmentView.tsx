'use client';

import { useState } from 'react';
import Link from 'next/link';
import { clsx } from '@/components/clsx';
import { ChevronLeftIcon } from '@/components/app/icons';
import type { Assessment, AssessmentContent, AssessmentItem } from '@/lib/types';

type Mode = 'paper' | 'markscheme';

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function AssessmentView({
  assessment,
  content,
}: {
  assessment: Assessment;
  content: AssessmentContent;
}) {
  const [mode, setMode] = useState<Mode>('paper');

  const chips = [
    assessment.exam_board,
    assessment.course_level,
    assessment.assessment_type,
    assessment.difficulty,
    `${content.totalMarks} marks`,
    `~${content.estimatedMinutes} min`,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="no-print">
        <Link href="/dashboard/assessments" className="inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:underline dark:text-violet-300">
          <ChevronLeftIcon className="h-4 w-4" /> Back to assessments
        </Link>
      </div>

      {/* Header */}
      <div className="no-print overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{assessment.title}</h1>
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
        <div className="inline-flex rounded-xl border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900" role="tablist" aria-label="View">
          {(['paper', 'markscheme'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={clsx(
                'min-h-10 rounded-lg px-4 text-sm font-semibold transition-colors',
                mode === m ? 'bg-violet-600 text-white shadow-sm' : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800',
              )}
            >
              {m === 'paper' ? 'Question paper' : 'Mark scheme'}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-sm font-bold text-white shadow-sm shadow-violet-500/25 transition-transform hover:scale-[1.02]"
        >
          <PrintIcon /> Print {mode === 'paper' ? 'paper' : 'mark scheme'}
        </button>
      </div>

      {/* On-screen view */}
      <div className="no-print rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{content.intro}</p>
        <ol className="mt-5 space-y-3">
          {content.items.map((item) => (
            <li key={item.number} className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                  {item.number}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    {item.prompt}
                    <span className="text-zinc-400 dark:text-zinc-500"> ({item.marks} {item.marks === 1 ? 'mark' : 'marks'})</span>
                  </p>

                  {item.options ? (
                    <ul className="mt-2 space-y-1">
                      {item.options.map((opt, oi) => (
                        <li key={oi} className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                          <span className="font-semibold text-zinc-500 dark:text-zinc-400">{OPTION_LABELS[oi]}</span>
                          <span>{opt}</span>
                        </li>
                      ))}
                    </ul>
                  ) : mode === 'paper' ? (
                    <div className="mt-2 h-12 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700" aria-hidden="true" />
                  ) : null}

                  {mode === 'markscheme' ? (
                    <p className="mt-2 rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-900 dark:bg-violet-950/40 dark:text-violet-100">
                      <span className="font-semibold">Mark scheme:</span> {item.markScheme}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
        {mode === 'markscheme' && content.teacherNotes ? (
          <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-inset ring-amber-100 dark:bg-amber-950/30 dark:text-amber-100 dark:ring-amber-900/60">
            <span className="font-semibold">Teacher notes:</span> {content.teacherNotes}
          </p>
        ) : null}
      </div>

      {/* Print-only block (reflects current mode) */}
      <PrintableAssessment assessment={assessment} content={content} mode={mode} chips={chips} />
    </div>
  );
}

/** Hidden on screen; rendered when the user prints (global print CSS). */
function PrintableAssessment({
  assessment,
  content,
  mode,
  chips,
}: {
  assessment: Assessment;
  content: AssessmentContent;
  mode: Mode;
  chips: string[];
}) {
  return (
    <div className="printable hidden print:block" style={{ color: '#18181b' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>{assessment.title}</h1>
      <p style={{ fontSize: '11px', color: '#52525b', marginTop: '4px' }}>
        {chips.join('  •  ')} — {mode === 'markscheme' ? 'Mark scheme' : 'Question paper'}
      </p>
      <p style={{ fontSize: '12px', marginTop: '12px' }}>{content.intro}</p>
      <ol style={{ marginTop: '12px', paddingLeft: '18px' }}>
        {content.items.map((item) => (
          <PrintQuestion key={item.number} item={item} mode={mode} />
        ))}
      </ol>
      {mode === 'markscheme' && content.teacherNotes ? (
        <p style={{ fontSize: '11px', marginTop: '12px', fontStyle: 'italic' }}>Teacher notes: {content.teacherNotes}</p>
      ) : null}
    </div>
  );
}

function PrintQuestion({ item, mode }: { item: AssessmentItem; mode: Mode }) {
  const needsLines = mode === 'paper' && !item.options;
  return (
    <li style={{ marginBottom: needsLines ? '24px' : '12px', fontSize: '12px' }}>
      <span style={{ fontWeight: 600 }}>{item.prompt}</span>
      <span style={{ color: '#71717a' }}> ({item.marks} {item.marks === 1 ? 'mark' : 'marks'})</span>
      {item.options ? (
        <div style={{ marginTop: '4px' }}>
          {item.options.map((opt, oi) => (
            <div key={oi}>
              {OPTION_LABELS[oi]}. {opt}
            </div>
          ))}
        </div>
      ) : null}
      {mode === 'markscheme' ? (
        <div style={{ marginTop: '4px', color: '#6d28d9' }}>Mark scheme: {item.markScheme}</div>
      ) : needsLines ? (
        <div style={{ borderBottom: '1px solid #d4d4d8', marginTop: '16px' }} />
      ) : null}
    </li>
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
