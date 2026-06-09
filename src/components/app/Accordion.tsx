'use client';

import { useState } from 'react';
import { clsx } from '@/components/clsx';

/**
 * Collapsible section for the lesson workspace. One-tap expand on mobile, with
 * an accessible button header (`aria-expanded` + `aria-controls`). The body
 * stays mounted only while open to keep long lessons light.
 */
export function Accordion({
  title,
  badge,
  icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  badge?: string | number;
  icon?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = `acc-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center gap-3 px-4 py-4 text-left sm:px-5"
      >
        {icon ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300">
            {icon}
          </span>
        ) : null}
        <span className="min-w-0 flex-1 font-display text-[15px] font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </span>
        {badge !== undefined ? (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {badge}
          </span>
        ) : null}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={clsx('shrink-0 text-zinc-400 transition-transform', open && 'rotate-180')}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <div id={id} className="border-t border-zinc-100 p-4 sm:p-5 dark:border-zinc-800">
          {children}
        </div>
      ) : null}
    </div>
  );
}
