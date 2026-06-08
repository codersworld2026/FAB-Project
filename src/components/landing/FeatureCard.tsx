import Link from 'next/link';
import { clsx } from '@/components/clsx';

export type FeatureColor = 'violet' | 'pink' | 'indigo' | 'amber';

const THEME: Record<
  FeatureColor,
  { card: string; icon: string; link: string }
> = {
  violet: {
    card: 'bg-violet-50/70 ring-violet-100 hover:ring-violet-200',
    icon: 'bg-violet-600',
    link: 'text-violet-700',
  },
  pink: {
    card: 'bg-pink-50/70 ring-pink-100 hover:ring-pink-200',
    icon: 'bg-pink-500',
    link: 'text-pink-600',
  },
  indigo: {
    card: 'bg-indigo-50/70 ring-indigo-100 hover:ring-indigo-200',
    icon: 'bg-indigo-600',
    link: 'text-indigo-700',
  },
  amber: {
    card: 'bg-amber-50/70 ring-amber-100 hover:ring-amber-200',
    icon: 'bg-amber-500',
    link: 'text-amber-700',
  },
};

export function FeatureCard({
  color,
  icon,
  title,
  description,
  preview,
  href = '/signup',
}: {
  color: FeatureColor;
  icon: React.ReactNode;
  title: string;
  description: string;
  preview: React.ReactNode;
  href?: string;
}) {
  const t = THEME[color];
  return (
    <div
      className={clsx(
        'group flex flex-col rounded-3xl p-5 ring-1 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
        t.card,
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={clsx(
            'flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm',
            t.icon,
          )}
        >
          {icon}
        </span>
      </div>

      {/* Mini preview */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-white bg-white p-3 shadow-sm">
        {preview}
      </div>

      <h3 className="mt-4 text-lg font-bold text-zinc-900">{title}</h3>
      <p className="mt-1 flex-1 text-sm leading-relaxed text-zinc-600">
        {description}
      </p>
      <Link
        href={href}
        className={clsx(
          'mt-4 inline-flex items-center gap-1 text-sm font-semibold',
          t.link,
        )}
      >
        Learn more <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
      </Link>
    </div>
  );
}
