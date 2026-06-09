import Link from 'next/link';
import { clsx } from '@/components/clsx';
import { ChevronRightIcon } from './icons';

export type CardAccent = 'violet' | 'indigo' | 'sky' | 'amber';

const ACCENT: Record<CardAccent, string> = {
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
  sky: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
};

/**
 * Full-width tappable card (icon + title + subtitle + chevron) — the whole card
 * is the action. Used on the dashboard "What shall we create today?" hub.
 */
export function CreationTypeCard({
  href,
  icon,
  title,
  subtitle,
  accent = 'violet',
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  accent?: CardAccent;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-20 items-center gap-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-lg active:translate-y-0 active:shadow-sm sm:p-5 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800"
    >
      <span className={clsx('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', ACCENT[accent])}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-display text-base font-bold tracking-tight text-zinc-900 sm:text-lg dark:text-zinc-50">
            {title}
          </span>
          {badge ? (
            <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="mt-0.5 block truncate text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</span>
      </span>
      <ChevronRightIcon className="h-5 w-5 shrink-0 text-zinc-300 transition-colors group-hover:text-violet-500 dark:text-zinc-600" />
    </Link>
  );
}
