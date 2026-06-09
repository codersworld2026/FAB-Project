import Link from 'next/link';

/**
 * Polished empty state — friendly icon, title, one sentence, primary action,
 * and an optional secondary help link. Used across every resource page so no
 * screen is a blank grey box.
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-violet-200 bg-violet-50/40 px-6 py-12 text-center sm:py-16 dark:border-zinc-700 dark:bg-zinc-900/50">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-inset ring-violet-100 dark:bg-zinc-800 dark:text-violet-300 dark:ring-zinc-700">
        {icon}
      </div>
      <h2 className="mt-5 text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 font-display text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-[1.02] active:scale-100"
        >
          {actionLabel}
        </Link>
      ) : null}
      {secondaryLabel && secondaryHref ? (
        <Link
          href={secondaryHref}
          className="mt-3 text-sm font-semibold text-violet-700 hover:underline dark:text-violet-300"
        >
          {secondaryLabel}
        </Link>
      ) : null}
    </div>
  );
}
