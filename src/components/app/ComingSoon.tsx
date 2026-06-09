import Link from 'next/link';
import { SparkleIcon } from '@/components/science/ScienceIcons';

/**
 * Honest "coming soon" scaffold for resource types whose generation isn't built
 * yet (lesson series, activity sheets, assessments). Shows what's planned and
 * routes teachers to the working single-lesson flow — no fake create button.
 */
export function ComingSoon({
  icon,
  title,
  description,
  features,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col items-center bg-lavender px-6 py-10 text-center dark:bg-zinc-900">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm ring-1 ring-inset ring-violet-100 dark:bg-zinc-800 dark:text-violet-300 dark:ring-zinc-700">
          {icon}
        </div>
        <h2 className="mt-5 text-lg font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {description}
        </p>
        <Link
          href="/dashboard/generate"
          className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 font-display text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-[1.02]"
        >
          Create a single lesson instead
        </Link>
      </div>

      <div className="px-6 py-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          What&apos;s coming
        </p>
        <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {features.map((f) => (
            <li
              key={f}
              className="flex items-start gap-2.5 text-sm text-zinc-700 dark:text-zinc-200"
            >
              <SparkleIcon className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
