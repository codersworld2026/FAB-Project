'use client';

import { useState } from 'react';
import { clsx } from '@/components/clsx';
import { BottomSheet } from './BottomSheet';

export type PillOption = { value: string; label: string };

/**
 * Pill-style selector — a compact rounded button showing the current value that
 * opens a bottom sheet of options on tap. Reused across the creation flow for
 * qualification, year group, lesson length and class level.
 */
export function PillSelect({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  options: PillOption[];
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-violet-200 bg-white px-4 text-sm font-semibold text-zinc-800 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-violet-700 dark:hover:bg-zinc-700"
      >
        {icon ? <span className="text-violet-600 dark:text-violet-300">{icon}</span> : null}
        <span className="max-w-[12rem] truncate">{current?.label ?? label}</span>
        <ChevronDown className="h-4 w-4 text-zinc-400" />
      </button>

      <BottomSheet open={open} onClose={() => setOpen(false)} title={label}>
        <ul className="space-y-1.5">
          {options.map((o) => {
            const selected = o.value === value;
            return (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  aria-pressed={selected}
                  className={clsx(
                    'flex min-h-12 w-full items-center justify-between rounded-xl px-4 text-left text-sm font-semibold transition-colors',
                    selected
                      ? 'bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200 dark:bg-violet-950/50 dark:text-violet-300 dark:ring-violet-900'
                      : 'text-zinc-800 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-800',
                  )}
                >
                  {o.label}
                  {selected ? <CheckIcon className="h-5 w-5" /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </BottomSheet>
    </>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
