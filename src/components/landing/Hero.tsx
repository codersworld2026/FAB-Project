import Link from 'next/link';
import { LessonGeneratorPreview } from './LessonGeneratorPreview';
import {
  CellIcon,
  DnaIcon,
  MoleculeIcon,
  AtomIcon,
  SparkleIcon,
} from '@/components/science/ScienceIcons';

const TRUST = [
  'Exam-board aligned',
  'Original content — never copied',
  'Ready in minutes',
];

export function Hero({ ctaHref }: { ctaHref: string }) {
  return (
    <section className="relative overflow-hidden">
      {/* Layered background: lavender wash + animated colour blobs + lab grid */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-violet-100 via-violet-50/60 to-white" />
      <div className="bg-lab-grid pointer-events-none absolute inset-0 -z-20 opacity-60" />
      <div className="pointer-events-none absolute -right-24 -top-16 -z-10 h-80 w-80 rounded-full bg-fuchsia-300/40 blur-3xl motion-safe:animate-blob" />
      <div className="pointer-events-none absolute -left-24 top-40 -z-10 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl motion-safe:animate-blob [animation-delay:-6s]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl motion-safe:animate-blob [animation-delay:-3s]" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:py-24">
        {/* Left — copy */}
        <div className="text-center lg:text-left motion-safe:animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-700 shadow-sm ring-1 ring-inset ring-violet-200 backdrop-blur sm:text-xs">
            <SparkleIcon className="h-3.5 w-3.5" />
            Built for science teachers
          </span>

          <h1 className="mt-5 text-[2.05rem] font-extrabold leading-[1.07] tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.4rem]">
            Create complete{' '}
            <span className="text-gradient-brand motion-safe:animate-gradient">
              science lesson packs
            </span>{' '}
            in minutes
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg lg:mx-0">
            Generate lesson plans, slides, differentiated worksheets, assessments
            and teacher notes — tailored to your exam board and your class.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href={ctaHref}
              className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/40 sm:w-auto"
            >
              Create a lesson pack
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href="#how"
              className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white/80 px-6 py-3.5 text-base font-semibold text-zinc-800 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:text-violet-700 sm:w-auto"
            >
              See how it works
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

        {/* Right — generator preview wrapped in floating science graphics */}
        <div className="relative motion-safe:animate-fade-up [animation-delay:120ms]">
          {/* Floating science shapes (desktop only, decorative) */}
          <DnaIcon className="absolute -left-6 top-2 z-0 hidden h-14 w-14 text-violet-300 motion-safe:animate-float lg:block" />
          <MoleculeIcon className="absolute -right-4 -top-6 z-30 hidden h-16 w-16 text-cyan-400/80 motion-safe:animate-float-slow lg:block" />
          <AtomIcon className="absolute -left-10 bottom-10 z-0 hidden h-14 w-14 text-sky-300 motion-safe:animate-float-slow lg:block" />
          <CellIcon className="absolute -bottom-6 right-6 z-30 hidden h-16 w-16 text-fuchsia-300 motion-safe:animate-float lg:block" />

          <div className="relative mx-auto w-full max-w-sm">
            <div className="pointer-events-none absolute inset-x-4 -bottom-4 -z-10 h-28 rounded-full bg-violet-400/25 blur-2xl" />
            <div className="motion-safe:animate-float-slow">
              <LessonGeneratorPreview />
            </div>

            {/* "Pack ready" pill */}
            <div className="absolute -bottom-3 left-2 z-40 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-zinc-800 shadow-lg ring-1 ring-violet-100">
              <CheckCircle /> 8 resources, one pack
            </div>
          </div>

          {/* Mobile supporting chips so the hero feels rich on small screens */}
          <div className="mx-auto mt-6 grid w-full max-w-sm grid-cols-3 gap-2 lg:hidden">
            {[
              { Icon: CellIcon, label: 'Biology', cls: 'text-fuchsia-600 bg-fuchsia-50' },
              { Icon: MoleculeIcon, label: 'Aligned', cls: 'text-cyan-600 bg-cyan-50' },
              { Icon: AtomIcon, label: 'Minutes', cls: 'text-violet-600 bg-violet-50' },
            ].map(({ Icon, label, cls }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 rounded-2xl border border-violet-100 bg-white/80 py-3 shadow-sm backdrop-blur"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${cls}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-semibold text-zinc-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckCircle() {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
      <svg width="10" height="10" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M16 5.5L8.25 14L4 9.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
