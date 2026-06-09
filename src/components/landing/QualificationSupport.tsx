import { APP_CONFIG, PEARSON_NOTICE } from '@/lib/config';
import { CellIcon, DnaIcon } from '@/components/science/ScienceIcons';

const POINTS = [
  'Structured around your selected qualification',
  'Differentiated for Support, Core and Challenge',
  'Adapted for SEND and EAL learners',
  'Built around the topic and class in front of you',
];

const TILES = [
  { Icon: CellIcon, title: 'Edexcel GCSE Biology', sub: 'Pearson Edexcel · KS4' },
  { Icon: DnaIcon, title: 'Edexcel International GCSE Biology', sub: 'Pearson Edexcel · KS4' },
];

export function QualificationSupport() {
  return (
    <section id="qualifications" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-white p-6 shadow-sm sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 sm:text-sm">
                Curriculum-aligned
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                GCSE &amp; International GCSE support
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                Designed to support teaching of Pearson Edexcel GCSE Biology and
                Pearson Edexcel International GCSE Biology — the two specifications
                kept separate so content always matches the qualification you teach.
              </p>
              <ul className="mt-6 space-y-3">
                {POINTS.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    <CheckCircle />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4">
              {TILES.map(({ Icon, title, sub }) => (
                <div
                  key={title}
                  className="flex items-center gap-4 rounded-2xl border border-violet-100 bg-lavender p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/50"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="font-display text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="relative mt-8 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 ring-1 ring-inset ring-amber-100 dark:bg-amber-950/30 dark:text-amber-100 dark:ring-amber-900/60">
            {PEARSON_NOTICE} {APP_CONFIG.name} is not affiliated with or endorsed
            by Pearson.
          </p>
        </div>
      </div>
    </section>
  );
}

function CheckCircle() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
      <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M16 5.5L8.25 14L4 9.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
