'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui';
import { clsx } from '@/components/clsx';
import type { PackContent } from '@/lib/types';

type Meta = {
  learningObjectives: string | null;
  teacherNotesInput: string | null;
  createdAt: string;
};

const TABS = [
  'Overview',
  'Lesson Plan',
  'Slides',
  'Worksheets',
  'Assessment',
  'Teacher Notes',
  'Export',
] as const;
type Tab = (typeof TABS)[number];

/** Tabbed, professional view of a generated lesson pack. */
export function PackContentView({
  content,
  meta,
}: {
  content: PackContent;
  meta: Meta;
}) {
  const [tab, setTab] = useState<Tab>('Overview');

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Tab bar — horizontally scrollable on mobile */}
      <div
        role="tablist"
        aria-label="Lesson pack sections"
        className="-mx-px flex gap-1 overflow-x-auto border-b border-zinc-100 px-3 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden dark:border-zinc-800"
      >
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={clsx(
              'shrink-0 whitespace-nowrap rounded-t-lg px-3.5 py-2.5 text-sm font-semibold transition-colors',
              tab === t
                ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-6">
        {tab === 'Overview' ? <OverviewTab content={content} meta={meta} /> : null}
        {tab === 'Lesson Plan' ? <LessonPlanTab content={content} /> : null}
        {tab === 'Slides' ? <SlidesTab content={content} /> : null}
        {tab === 'Worksheets' ? <WorksheetsTab content={content} /> : null}
        {tab === 'Assessment' ? <AssessmentTab content={content} /> : null}
        {tab === 'Teacher Notes' ? <TeacherNotesTab content={content} /> : null}
        {tab === 'Export' ? <ExportTab /> : null}
      </div>
    </div>
  );
}

/* ------------------------------ Overview ------------------------------ */
function OverviewTab({ content, meta }: { content: PackContent; meta: Meta }) {
  const totalMarks = content.assessment.questions.reduce((s, q) => s + q.marks, 0);
  const stats = [
    { label: 'Slides', value: content.slides.length },
    { label: 'Worksheets', value: content.worksheets.length },
    { label: 'Questions', value: content.assessment.questions.length },
    { label: 'Total marks', value: totalMarks },
  ];

  return (
    <div className="space-y-6">
      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">{content.overview.summary}</p>

      {/* At a glance */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-violet-50/60 p-3 text-center ring-1 ring-inset ring-violet-100 dark:bg-violet-950/30 dark:ring-violet-900">
            <p className="text-2xl font-extrabold text-violet-700 dark:text-violet-300">{s.value}</p>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <SectionLabel>Learning objectives</SectionLabel>
        <ul className="mt-2 space-y-1.5">
          {content.overview.objectives.map((o, i) => (
            <li key={i} className="flex gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <Tick /> {o}
            </li>
          ))}
        </ul>
      </div>

      {(meta.learningObjectives || meta.teacherNotesInput) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {meta.learningObjectives ? (
            <Detail label="Your objectives" value={meta.learningObjectives} />
          ) : null}
          {meta.teacherNotesInput ? (
            <Detail label="Your class notes" value={meta.teacherNotesInput} />
          ) : null}
        </div>
      )}

      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        Created {new Date(meta.createdAt).toLocaleString('en-GB')}
      </p>
    </div>
  );
}

/* ----------------------------- Lesson plan ----------------------------- */
function LessonPlanTab({ content }: { content: PackContent }) {
  return (
    <ol className="space-y-3">
      {content.lessonPlan.sections.map((s, i) => (
        <li key={i} className="flex gap-4 rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-white text-center shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800">
            <span className="text-base font-extrabold text-violet-700 dark:text-violet-300">
              {s.durationMins ?? '—'}
            </span>
            <span className="text-[10px] font-medium uppercase text-zinc-400 dark:text-zinc-500">min</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{s.title}</p>
            <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-300">{s.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------- Slides ------------------------------- */
function SlidesTab({ content }: { content: PackContent }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {content.slides.map((slide, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-white/90">
              Slide {i + 1}
            </span>
          </div>
          <div className="p-4">
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{slide.title}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-zinc-600 dark:text-zinc-300">
              {slide.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
            {slide.teacherNotes ? (
              <p className="mt-3 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs italic text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                💡 {slide.teacherNotes}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- Worksheets ----------------------------- */
function WorksheetsTab({ content }: { content: PackContent }) {
  return (
    <div className="space-y-4">
      {content.worksheets.map((w, i) => (
        <div key={i} className="rounded-xl border border-zinc-200 p-4 sm:p-5 dark:border-zinc-800">
          <div className="mb-3 flex items-center gap-2">
            <Badge color={worksheetColor(w.level)}>{w.level}</Badge>
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{w.title}</span>
          </div>
          {w.intro ? <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">{w.intro}</p> : null}
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            {w.questions.map((q, j) => (
              <li key={j}>
                {q.prompt}
                {q.marks ? <span className="text-zinc-400 dark:text-zinc-500"> ({q.marks} marks)</span> : null}
              </li>
            ))}
          </ol>
          <details className="group mt-3">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 [&::-webkit-details-marker]:hidden dark:bg-violet-950/50 dark:text-violet-300">
              Show answer key
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transition-transform group-open:rotate-180" aria-hidden="true">
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <ol className="mt-2 list-decimal space-y-1 rounded-lg bg-zinc-50 p-3 pl-7 text-xs text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300">
              {w.answers.map((a, j) => (
                <li key={j}>{a}</li>
              ))}
            </ol>
          </details>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- Assessment ----------------------------- */
function AssessmentTab({ content }: { content: PackContent }) {
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Questions</SectionLabel>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          {content.assessment.questions.map((q, i) => (
            <li key={i}>
              {q.prompt}
              <span className="font-medium text-zinc-400 dark:text-zinc-500"> ({q.marks} marks)</span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <SectionLabel>Mark scheme</SectionLabel>
        <div className="mt-2 space-y-2">
          {content.markScheme.map((m, i) => (
            <div key={i} className="rounded-lg border border-zinc-100 bg-zinc-50/60 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-800/40">
              <span className="font-bold text-violet-700 dark:text-violet-300">{m.questionRef}</span>{' '}
              <span className="text-zinc-600 dark:text-zinc-300">{m.answer}</span>{' '}
              <span className="font-semibold text-zinc-400 dark:text-zinc-500">[{m.marks}]</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- Teacher notes ---------------------------- */
function TeacherNotesTab({ content }: { content: PackContent }) {
  return (
    <div className="space-y-6">
      <NoteBlock title="Common misconceptions" accent="bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-200" items={content.teacherNotes.misconceptions} />
      <NoteBlock title="Key teaching points" accent="bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-200" items={content.teacherNotes.teachingPoints} />
      {content.teacherNotes.safety ? (
        <div>
          <SectionLabel>Safety</SectionLabel>
          <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            {content.teacherNotes.safety}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function NoteBlock({ title, accent, items }: { title: string; accent: string; items: string[] }) {
  return (
    <div>
      <SectionLabel>{title}</SectionLabel>
      <ul className="mt-2 space-y-2">
        {items.map((m, i) => (
          <li key={i} className={clsx('rounded-lg px-3 py-2 text-sm', accent)}>
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------- Export ------------------------------- */
function ExportTab() {
  return (
    <div className="space-y-5">
      <p className="text-sm text-zinc-600 dark:text-zinc-300">
        Download your pack to edit, print and share. PDF and PowerPoint exports
        are coming in the next release — the full content is ready to use now.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <ExportButton label="Download PDF" sub="Lesson plan, worksheets & assessment" icon="📄" />
        <ExportButton label="Download PowerPoint" sub="Editable slide deck" icon="📊" />
      </div>
      <p className="rounded-xl bg-zinc-50 px-4 py-3 text-xs text-zinc-500 ring-1 ring-inset ring-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-400 dark:ring-zinc-800">
        Tip: every pack is original content, generated for your class — review
        before teaching, and adapt anything you&apos;d like to tweak.
      </p>
    </div>
  );
}

function ExportButton({ label, sub, icon }: { label: string; sub: string; icon: string }) {
  return (
    <button
      type="button"
      disabled
      title="Available in a later release"
      className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left dark:border-zinc-800 dark:bg-zinc-800/40"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl shadow-sm dark:bg-zinc-900">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-500 dark:text-zinc-400">
          {label}
          <span className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] font-bold uppercase text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300">
            Soon
          </span>
        </span>
        <span className="block text-xs text-zinc-400 dark:text-zinc-500">{sub}</span>
      </span>
    </button>
  );
}

/* ------------------------------ helpers ------------------------------ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{children}</p>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-0.5 whitespace-pre-line text-sm text-zinc-800 dark:text-zinc-200">{value}</p>
    </div>
  );
}

function Tick() {
  return (
    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300">
      <svg width="9" height="9" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M16 5.5L8.25 14L4 9.75" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function worksheetColor(level: string): 'blue' | 'zinc' | 'violet' {
  if (level === 'Foundation') return 'blue';
  if (level === 'Mastery') return 'violet';
  return 'zinc';
}
