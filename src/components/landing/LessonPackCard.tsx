import { clsx } from '@/components/clsx';

export type PackAccent = 'violet' | 'cyan' | 'pink' | 'indigo' | 'emerald' | 'amber' | 'sky' | 'rose';

const ACCENT: Record<PackAccent, { icon: string; glow: string; tag: string }> = {
  violet: { icon: 'bg-violet-600', glow: 'group-hover:shadow-violet-300/50 dark:group-hover:shadow-violet-950/50', tag: 'text-violet-700 bg-violet-50 dark:text-violet-300 dark:bg-violet-950/50' },
  cyan: { icon: 'bg-cyan-500', glow: 'group-hover:shadow-cyan-300/50 dark:group-hover:shadow-cyan-950/50', tag: 'text-cyan-700 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-950/50' },
  pink: { icon: 'bg-pink-500', glow: 'group-hover:shadow-pink-300/50 dark:group-hover:shadow-pink-950/50', tag: 'text-pink-700 bg-pink-50 dark:text-pink-300 dark:bg-pink-950/50' },
  indigo: { icon: 'bg-indigo-600', glow: 'group-hover:shadow-indigo-300/50 dark:group-hover:shadow-indigo-950/50', tag: 'text-indigo-700 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950/50' },
  emerald: { icon: 'bg-emerald-500', glow: 'group-hover:shadow-emerald-300/50 dark:group-hover:shadow-emerald-950/50', tag: 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/50' },
  amber: { icon: 'bg-amber-500', glow: 'group-hover:shadow-amber-300/50 dark:group-hover:shadow-amber-950/50', tag: 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/50' },
  sky: { icon: 'bg-sky-500', glow: 'group-hover:shadow-sky-300/50 dark:group-hover:shadow-sky-950/50', tag: 'text-sky-700 bg-sky-50 dark:text-sky-300 dark:bg-sky-950/50' },
  rose: { icon: 'bg-rose-500', glow: 'group-hover:shadow-rose-300/50 dark:group-hover:shadow-rose-950/50', tag: 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/50' },
};

/** A single resource included in a generated pack (used in the grid). */
export function LessonPackCard({
  accent,
  icon,
  title,
  description,
  tag,
}: {
  accent: PackAccent;
  icon: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
}) {
  const a = ACCENT[accent];
  return (
    <div
      className={clsx(
        'group flex h-full flex-col rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900',
        a.glow,
      )}
    >
      <div className="flex items-center justify-between">
        <span className={clsx('flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm', a.icon)}>
          {icon}
        </span>
        {tag ? (
          <span className={clsx('rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide', a.tag)}>
            {tag}
          </span>
        ) : null}
      </div>
      <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{description}</p>
    </div>
  );
}
