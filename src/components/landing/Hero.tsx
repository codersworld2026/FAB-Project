import Link from 'next/link';
import { LessonGeneratorPreview } from './LessonGeneratorPreview';

const TRUST = ['Standards-aligned', 'Saves hours every week', 'Built for busy teachers'];

const FLOATING = [
  {
    title: 'Plant Cells',
    meta: 'Year 7 · Science',
    emoji: '🧫',
    gradient: 'from-emerald-200 to-teal-300',
    className: 'left-0 top-2 hidden lg:block',
  },
  {
    title: 'The Solar System',
    meta: 'Year 7 · Science',
    emoji: '🪐',
    gradient: 'from-indigo-300 to-violet-500',
    className: 'right-0 top-24 hidden lg:block',
  },
  {
    title: 'The Human Heart',
    meta: 'Year 7 · Biology',
    emoji: '🫀',
    gradient: 'from-rose-200 to-pink-300',
    className: 'bottom-2 right-8 hidden xl:block',
  },
];

export function Hero({ ctaHref }: { ctaHref: string }) {
  return (
    <section className="relative overflow-hidden">
      {/* Lavender background wash */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-violet-50 via-violet-50/40 to-white" />
      <div className="pointer-events-none absolute -right-24 top-10 -z-10 h-72 w-72 rounded-full bg-fuchsia-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 top-40 -z-10 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:py-20">
        {/* Left */}
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-violet-700 shadow-sm ring-1 ring-inset ring-violet-200">
            ✨ AI lesson creator for teachers
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Create <span className="text-violet-600">teacher-ready</span> lessons
            in seconds
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-zinc-600">
            Generate slides, worksheets, quizzes, lesson plans and assessments in
            seconds. Built for real classrooms. Aligned to standards.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-300/50 transition-colors hover:bg-violet-700"
            >
              Create a lesson <span aria-hidden="true">→</span>
            </Link>
            <a
              href="#example"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-base font-semibold text-zinc-800 shadow-sm transition-colors hover:border-violet-300 hover:text-violet-700"
            >
              View examples <span aria-hidden="true">👁</span>
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                <CheckCircle />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: preview + floating cards */}
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
          <div className="relative w-full">
            {FLOATING.map((card) => (
              <div
                key={card.title}
                className={`absolute z-20 w-44 rounded-2xl border border-white/60 bg-white p-2.5 shadow-xl shadow-violet-200/40 ${card.className}`}
              >
                <div
                  className={`flex h-20 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-3xl`}
                >
                  {card.emoji}
                </div>
                <div className="mt-2 px-1 pb-1">
                  <span className="rounded-md bg-violet-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-violet-600">
                    Lesson
                  </span>
                  <p className="mt-1 text-sm font-bold text-zinc-900">{card.title}</p>
                  <p className="text-[11px] text-zinc-500">{card.meta}</p>
                </div>
              </div>
            ))}

            <div className="relative z-10 mx-auto flex justify-center">
              <LessonGeneratorPreview />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 left-4 z-30 hidden items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-800 shadow-lg ring-1 ring-violet-100 sm:flex">
              <CheckCircle /> Worksheet included
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckCircle() {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
      <svg width="10" height="10" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M16 5.5L8.25 14L4 9.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
