import { MicroscopeIcon } from '@/components/science/ScienceIcons';

const TAILORED = [
  'Matched to your exam board and specification',
  'Differentiated for mixed-ability classes',
  'Adapted for SEND and EAL learners',
  'Targets the misconceptions your pupils actually have',
];

export function BuiltForTeachers() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="pointer-events-none absolute -left-20 top-10 -z-10 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
        {/* Copy */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 sm:text-sm">
            Built for real teachers
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
            Generic resources still need an hour of adapting
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            Downloaded worksheets rarely fit your class. You still re-level the
            questions, add scaffolds for EAL pupils, and rewrite the parts that
            don&apos;t match your spec. Lessons Generator does that part for you —
            every resource is built around the class in front of you.
          </p>
          <ul className="mt-6 space-y-3">
            {TAILORED.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm font-medium text-zinc-700 dark:text-zinc-200">
                <CheckCircle />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual: generic → tailored */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-x-8 -bottom-4 -z-10 h-28 rounded-full bg-violet-300/30 blur-2xl" />
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Generic */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="inline-flex rounded-full bg-zinc-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                Generic
              </span>
              <p className="mt-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">One-size worksheet</p>
              <div className="mt-3 space-y-2 opacity-60">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className="block h-2.5 rounded bg-zinc-200 dark:bg-zinc-700" style={{ width: `${90 - i * 8}%` }} />
                ))}
              </div>
              <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">+ ~1 hour adapting</p>
            </div>

            {/* Tailored */}
            <div className="relative rounded-2xl border border-violet-200 bg-white p-5 shadow-xl shadow-violet-200/40 sm:-mt-4 sm:mb-4 dark:border-violet-900 dark:bg-zinc-900 dark:shadow-violet-950/40">
              <div className="flex items-center justify-between">
                <span className="inline-flex rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                  Tailored
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300">
                  <MicroscopeIcon className="h-5 w-5" />
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">3 differentiated tiers</p>
              <div className="mt-3 space-y-2">
                <Bar label="Foundation" color="bg-emerald-400" w="78%" />
                <Bar label="Standard" color="bg-violet-500" w="92%" />
                <Bar label="Mastery" color="bg-rose-400" w="68%" />
              </div>
              <p className="mt-4 text-xs font-semibold text-violet-700 dark:text-violet-300">Ready to teach</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bar({ label, color, w }: { label: string; color: string; w: string }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
      <span className={`block h-2.5 rounded ${color}`} style={{ width: w }} />
    </div>
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
