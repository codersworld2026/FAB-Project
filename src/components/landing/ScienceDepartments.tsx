import { CellIcon, FlaskIcon, AtomIcon } from '@/components/science/ScienceIcons';

const ROADMAP = ['Cambridge', 'Chemistry', 'Physics', 'KS3 Science', 'Exam preparation'];

export function ScienceDepartments() {
  return (
    <section id="departments" className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-white p-6 shadow-sm sm:p-10 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-fuchsia-200/40 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 sm:text-sm">
                Designed for science departments
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
                Starting with Biology — built to grow with your faculty
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
                We&apos;re launching with exam-board-aligned Biology so we can get
                the quality right. Chemistry, Physics, more boards and KS3 are on
                the roadmap — the same packs, across your whole department.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-900">
                  <Dot className="bg-emerald-500" /> Available now
                </span>
                {ROADMAP.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-500 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700"
                  >
                    <Dot className="bg-zinc-300 dark:bg-zinc-600" /> {r}
                    <span className="text-[10px] font-semibold uppercase text-zinc-400 dark:text-zinc-500">soon</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Available-now showcase tiles */}
            <div className="grid grid-cols-2 gap-4">
              <ShowcaseTile Icon={CellIcon} title="Biology" subtitle="IGCSE · GCSE · A-Level" accent="text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-950/50 dark:text-fuchsia-300" live />
              <ShowcaseTile letters="Ed" title="Edexcel" subtitle="Spec-aligned content" accent="text-violet-600 bg-violet-50 dark:bg-violet-950/50 dark:text-violet-300" live />
              <ShowcaseTile Icon={FlaskIcon} title="Chemistry" subtitle="On the roadmap" accent="text-cyan-600 bg-cyan-50 dark:bg-cyan-950/50 dark:text-cyan-300" />
              <ShowcaseTile Icon={AtomIcon} title="Physics" subtitle="On the roadmap" accent="text-sky-600 bg-sky-50 dark:bg-sky-950/50 dark:text-sky-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseTile({
  Icon,
  letters,
  title,
  subtitle,
  accent,
  live,
}: {
  Icon?: React.ComponentType<{ className?: string }>;
  letters?: string;
  title: string;
  subtitle: string;
  accent: string;
  live?: boolean;
}) {
  return (
    <div className={`relative rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/50 ${live ? '' : 'opacity-70'}`}>
      {live ? (
        <span className="absolute right-3 top-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
          <Dot className="bg-emerald-500" /> Live
        </span>
      ) : null}
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-base font-extrabold ${accent}`}>
        {Icon ? <Icon className="h-6 w-6" /> : letters}
      </span>
      <p className="mt-3 text-sm font-bold text-zinc-900 dark:text-zinc-50">{title}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">{subtitle}</p>
    </div>
  );
}

function Dot({ className }: { className?: string }) {
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${className ?? ''}`} aria-hidden="true" />;
}
