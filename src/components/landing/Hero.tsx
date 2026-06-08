import Link from 'next/link';
import { LessonGeneratorPreview } from './LessonGeneratorPreview';

const TRUST = ['Standards-aligned', 'Saves hours every week', 'Built for busy teachers'];

const LESSON_CARDS = [
  {
    title: 'Plant Cells',
    meta: 'Year 7 · Science',
    emoji: '🧫',
    gradient: 'from-emerald-200 to-teal-300',
  },
  {
    title: 'The Solar System',
    meta: 'Year 7 · Science',
    emoji: '🪐',
    gradient: 'from-indigo-300 to-violet-500',
  },
  {
    title: 'The Human Heart',
    meta: 'Year 7 · Biology',
    emoji: '🫀',
    gradient: 'from-rose-200 to-pink-300',
  },
];

export function Hero({ ctaHref }: { ctaHref: string }) {
  return (
    <section className="relative overflow-hidden">
      {/* Lavender background wash + glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-violet-100 via-violet-50/50 to-white" />
      <div className="pointer-events-none absolute -right-24 top-0 -z-10 h-80 w-80 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-48 -z-10 h-80 w-80 rounded-full bg-violet-300/30 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:py-24">
        {/* Left */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-700 shadow-sm ring-1 ring-inset ring-violet-200 sm:text-xs">
            ✨ AI lesson creator for teachers
          </span>
          <h1 className="mt-5 text-[2rem] font-extrabold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Create <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">teacher-ready</span> lessons in seconds
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg lg:mx-0">
            Generate slides, worksheets, quizzes, lesson plans and assessments in
            seconds. Built for real classrooms. Aligned to standards.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href={ctaHref}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-400/40 transition-all hover:-translate-y-0.5 hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-400/50 sm:w-auto"
            >
              Create a lesson <span aria-hidden="true">→</span>
            </Link>
            <a
              href="#example"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-violet-100 bg-white px-6 py-3.5 text-base font-semibold text-zinc-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-700 sm:w-auto"
            >
              View examples <span aria-hidden="true">👁</span>
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap justify-center gap-x-5 gap-y-2 lg:justify-start">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                <CheckCircle />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Right visual */}
        <div className="relative">
          {/* Desktop: floating arrangement */}
          <div className="relative hidden lg:block">
            <FloatingCard card={LESSON_CARDS[0]} className="left-0 top-2" />
            <FloatingCard card={LESSON_CARDS[1]} className="right-0 top-24" />
            <FloatingCard card={LESSON_CARDS[2]} className="bottom-2 right-10 hidden xl:block" />
            <div className="relative z-10 flex justify-center">
              <LessonGeneratorPreview />
            </div>
            <div className="absolute -bottom-4 left-4 z-30 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-800 shadow-lg ring-1 ring-violet-100">
              <CheckCircle /> Worksheet included
            </div>
          </div>

          {/* Mobile / tablet: clean compact stack (no overflow) */}
          <div className="lg:hidden">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="pointer-events-none absolute inset-x-6 -bottom-3 -z-10 h-24 rounded-full bg-violet-400/20 blur-2xl" />
              <LessonGeneratorPreview />
            </div>
            <div className="mx-auto mt-4 grid w-full max-w-sm grid-cols-2 gap-3">
              {LESSON_CARDS.slice(0, 2).map((card) => (
                <MiniLessonCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FloatingCard({
  card,
  className,
}: {
  card: (typeof LESSON_CARDS)[number];
  className?: string;
}) {
  return (
    <div
      className={`absolute z-20 w-44 rounded-2xl border border-white/70 bg-white p-2.5 shadow-xl shadow-violet-200/50 transition-transform hover:-translate-y-1 ${className ?? ''}`}
    >
      <div className={`flex h-20 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-3xl`}>
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
  );
}

function MiniLessonCard({ card }: { card: (typeof LESSON_CARDS)[number] }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white p-2.5 shadow-md shadow-violet-200/40">
      <div className={`flex h-16 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-2xl`}>
        {card.emoji}
      </div>
      <p className="mt-2 px-1 text-sm font-bold text-zinc-900">{card.title}</p>
      <p className="px-1 text-[11px] text-zinc-500">{card.meta}</p>
    </div>
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
