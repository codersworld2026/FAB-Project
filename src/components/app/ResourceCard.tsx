import Link from 'next/link';
import { clsx } from '@/components/clsx';
import { ChevronRightIcon } from './icons';

export type ResourceStatus = 'draft' | 'needs_review' | 'approved';

const STATUS: Record<ResourceStatus, { label: string; cls: string }> = {
  draft: { label: 'Draft', cls: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300' },
  needs_review: { label: 'Needs review', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200' },
  approved: { label: 'Approved', cls: 'bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-200' },
};

/** A saved resource row/card — title, meta chips, status, and an action slot. */
export function ResourceCard({
  href,
  icon,
  title,
  meta,
  status,
  action,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  meta?: string[];
  status?: ResourceStatus;
  action?: React.ReactNode;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300">
        {icon}
      </span>
      <Link href={href} className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-display text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {title}
          </span>
          {status ? (
            <span className={clsx('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', STATUS[status].cls)}>
              {STATUS[status].label}
            </span>
          ) : null}
        </span>
        {meta && meta.length > 0 ? (
          <span className="mt-0.5 block truncate text-xs text-zinc-500 dark:text-zinc-400">
            {meta.filter(Boolean).join(' · ')}
          </span>
        ) : null}
      </Link>
      {action ? (
        <div className="shrink-0">{action}</div>
      ) : (
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-zinc-300 transition-colors group-hover:text-violet-500 dark:text-zinc-600" />
      )}
    </div>
  );
}
