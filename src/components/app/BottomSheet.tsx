'use client';

import { useEffect, useRef } from 'react';
import { clsx } from '@/components/clsx';
import { CloseIcon } from './icons';

/**
 * Mobile bottom sheet — slides up from the bottom on small screens and centres
 * as a dialog on larger ones. Backdrop click + ESC close it; body scroll is
 * locked while open; focus moves into the sheet and the panel is `aria-modal`.
 * Reused by filters, sort, share and export menus.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/50 backdrop-blur-[2px] motion-safe:animate-overlay-in"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Options'}
        tabIndex={-1}
        className={clsx(
          'relative max-h-[85vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl outline-none sticky-action-pad sm:max-w-md sm:rounded-3xl sm:pb-5 dark:bg-zinc-900',
          'motion-safe:animate-slide-up',
        )}
      >
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-zinc-200 sm:hidden dark:bg-zinc-700" aria-hidden="true" />
        {title ? (
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
