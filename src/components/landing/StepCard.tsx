import { clsx } from '@/components/clsx';

export type StepAccent = 'violet' | 'cyan' | 'pink';

const ACCENT: Record<StepAccent, { ring: string; chip: string; num: string }> = {
  violet: { ring: 'ring-violet-100 dark:ring-zinc-800', chip: 'bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300', num: 'from-violet-600 to-violet-500' },
  cyan: { ring: 'ring-cyan-100 dark:ring-zinc-800', chip: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300', num: 'from-cyan-500 to-sky-500' },
  pink: { ring: 'ring-pink-100 dark:ring-zinc-800', chip: 'bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-300', num: 'from-fuchsia-600 to-pink-500' },
};

export function StepCard({
  n,
  accent,
  icon,
  title,
  description,
}: {
  n: number;
  accent: StepAccent;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const a = ACCENT[accent];
  return (
    <div className={clsx('relative h-full rounded-3xl bg-white p-6 shadow-sm ring-1 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:bg-zinc-900', a.ring)}>
      <div className="flex items-center gap-3">
        <span className={clsx('flex h-12 w-12 items-center justify-center rounded-2xl', a.chip)}>
          {icon}
        </span>
        <span className={clsx('flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow', a.num)}>
          {n}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{description}</p>
    </div>
  );
}
