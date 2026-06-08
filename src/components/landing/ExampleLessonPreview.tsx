'use client';

import { useState } from 'react';
import Link from 'next/link';
import { clsx } from '@/components/clsx';

const TABS = [
  'Overview',
  'Slides (14)',
  'Worksheet',
  'Quiz',
  'Differentiation',
  'Exit Ticket',
] as const;
type Tab = (typeof TABS)[number];

export function ExampleLessonPreview({ ctaHref }: { ctaHref: string }) {
  const [tab, setTab] = useState<Tab>('Overview');

  return (
    <section id="example" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="grid gap-8 rounded-3xl bg-gradient-to-br from-violet-50 to-fuchsia-50 p-5 ring-1 ring-violet-100 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Left */}
        <div>
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700 ring-1 ring-inset ring-violet-200">
            Example lesson
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
            Year 7 Science: Cells and Microscopes
          </h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['Year 7', 'KS3', 'Science', '45 mins'].map((t) => (
              <span
                key={t}
                className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-200"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            A complete lesson with everything you need to teach, assess and
            differentiate.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
            >
              View full example
            </Link>
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 transition-colors hover:border-violet-300 hover:text-violet-700"
            >
              Use this lesson
            </Link>
          </div>
        </div>

        {/* Right: tabbed preview */}
        <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm sm:p-5">
          <div
            role="tablist"
            aria-label="Lesson preview"
            className="flex flex-wrap gap-1.5 border-b border-zinc-100 pb-3"
          >
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={clsx(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                  tab === t
                    ? 'bg-violet-600 text-white'
                    : 'text-zinc-500 hover:bg-violet-50 hover:text-violet-700',
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {tab === 'Overview' ? <Overview /> : <SimpleTab tab={tab} />}
          </div>
        </div>
      </div>
    </section>
  );
}

function Overview() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <MiniCard title="Learning Objectives">
        <ul className="space-y-1 text-xs text-zinc-600">
          <li className="flex gap-1.5"><Tick />Describe the structure of animal and plant cells.</li>
          <li className="flex gap-1.5"><Tick />Explain how microscopes help us see cells.</li>
        </ul>
      </MiniCard>

      <MiniCard title="Starter (5 mins)">
        <p className="text-xs font-semibold text-violet-700">Quick Quiz</p>
        <p className="text-xs text-zinc-600">
          5 multiple choice questions to activate prior knowledge.
        </p>
      </MiniCard>

      <MiniCard title="Key Vocabulary">
        <div className="flex flex-wrap gap-1">
          {['Cell', 'Nucleus', 'Cell membrane', 'Cytoplasm', 'Microscope', 'Magnification'].map((v) => (
            <span key={v} className="rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-700">
              {v}
            </span>
          ))}
        </div>
      </MiniCard>

      <MiniCard title="Main Activity (25 mins)">
        <p className="text-xs font-semibold text-violet-700">Microscope Lab 🔬</p>
        <p className="text-xs text-zinc-600">
          Students label cells and calculate magnification.
        </p>
      </MiniCard>

      <MiniCard title="Differentiation">
        <ul className="space-y-1 text-xs text-zinc-600">
          <li><Dot color="bg-violet-500" /><b>Support:</b> sentence stems &amp; vocab bank.</li>
          <li><Dot color="bg-amber-500" /><b>Core:</b> guided questions &amp; modelling.</li>
          <li><Dot color="bg-rose-500" /><b>Challenge:</b> apply to new contexts.</li>
        </ul>
      </MiniCard>

      <MiniCard title="Exit Ticket (5 mins)">
        <p className="text-xs text-zinc-600">
          3 quick questions to check understanding before they leave.
        </p>
      </MiniCard>
    </div>
  );
}

function SimpleTab({ tab }: { tab: Tab }) {
  const copy: Record<string, { emoji: string; text: string }> = {
    'Slides (14)': { emoji: '🖥️', text: '14 presentation-ready slides — title, objectives, content, guided and independent practice, and a plenary.' },
    Worksheet: { emoji: '📄', text: 'A differentiated worksheet with original questions and a matching answer key.' },
    Quiz: { emoji: '❓', text: 'An exam-style quiz with marks and an instant mark scheme.' },
    Differentiation: { emoji: '🎯', text: 'Support, Core and Challenge versions so every student is stretched appropriately.' },
    'Exit Ticket': { emoji: '🎟️', text: 'Three quick questions to check understanding before students leave.' },
  };
  const c = copy[tab];
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-violet-50/60 px-4 py-10 text-center">
      <span className="text-3xl">{c?.emoji}</span>
      <p className="mt-3 max-w-sm text-sm text-zinc-600">{c?.text}</p>
    </div>
  );
}

function MiniCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-3">
      <p className="mb-1.5 text-xs font-bold text-zinc-800">{title}</p>
      {children}
    </div>
  );
}
function Tick() {
  return <span className="mt-0.5 text-violet-600" aria-hidden="true">✓</span>;
}
function Dot({ color }: { color: string }) {
  return <span className={clsx('mr-1.5 inline-block h-2 w-2 rounded-full align-middle', color)} aria-hidden="true" />;
}
