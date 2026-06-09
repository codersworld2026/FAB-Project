import Link from 'next/link';
import { ChevronLeftIcon } from './icons';

/** Page header for resource sections — back link, title, subtitle, badge, action. */
export function SectionHeader({
  title,
  subtitle,
  badge,
  action,
  backHref,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  backHref?: string;
}) {
  return (
    <div className="space-y-3">
      {backHref ? (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:underline dark:text-violet-300"
        >
          <ChevronLeftIcon className="h-4 w-4" /> Back
        </Link>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              {title}
            </h1>
            {badge ? (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                {badge}
              </span>
            ) : null}
          </div>
          {subtitle ? (
            <p className="mt-1.5 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
