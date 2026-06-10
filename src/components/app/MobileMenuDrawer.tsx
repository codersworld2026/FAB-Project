'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { APP_CONFIG } from '@/lib/config';
import { clsx } from '@/components/clsx';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Avatar } from './Avatar';
import { NAV_ITEMS, isNavActive } from './navItems';
import { CloseIcon, LogoutIcon, GiftIcon, UsersIcon, LessonIcon } from './icons';

/**
 * Right-side navigation drawer. Backdrop click + ESC close it, Tab is trapped
 * inside the panel, body scroll is locked while open, and focus returns to the
 * trigger on close. Safe-area padding keeps CTAs clear of the home indicator.
 */
export function MobileMenuDrawer({
  open,
  onClose,
  name,
  email,
  team,
  isOwner = false,
}: {
  open: boolean;
  onClose: () => void;
  name?: string | null;
  email: string;
  team?: string | null;
  isOwner?: boolean;
}) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { signOut } = useClerk();

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/50 backdrop-blur-[2px] motion-safe:animate-overlay-in"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute inset-y-0 right-0 flex w-[84%] max-w-sm flex-col overflow-y-auto bg-white pt-safe shadow-2xl motion-safe:animate-slide-in-right dark:bg-zinc-950"
      >
        <div className="flex items-center justify-end px-4 pt-4">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* User */}
        <div className="flex flex-col items-center px-6 pb-2 pt-1 text-center">
          <Avatar name={name} email={email} size="lg" />
          <p className="mt-3 font-display text-base font-bold text-zinc-900 dark:text-zinc-50">
            {name?.trim() || email.split('@')[0]}
          </p>
          {team ? (
            <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <UsersIcon className="h-3.5 w-3.5" /> {team}
            </p>
          ) : (
            <p className="mt-0.5 truncate text-xs text-zinc-400 dark:text-zinc-500">{email}</p>
          )}
        </div>

        {/* Links */}
        <nav className="flex flex-col px-3 py-3">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = isNavActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={clsx(
                  'flex min-h-12 items-center gap-3 rounded-xl px-3 font-display text-base font-bold tracking-tight transition-colors',
                  active
                    ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
                    : 'text-zinc-800 hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-900',
                )}
              >
                <Icon className="h-5 w-5 shrink-0 opacity-80" />
                {label}
              </Link>
            );
          })}

          {isOwner ? (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex min-h-12 items-center gap-3 rounded-xl px-3 font-display text-base font-bold tracking-tight text-zinc-800 transition-colors hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-900"
            >
              <UsersIcon className="h-5 w-5 shrink-0 opacity-80" />
              Admin
            </Link>
          ) : null}

          <button
            type="button"
            onClick={() => {
              onClose();
              signOut({ redirectUrl: '/login' });
            }}
            className="flex min-h-12 items-center gap-3 rounded-xl px-3 font-display text-base font-bold tracking-tight text-zinc-800 transition-colors hover:bg-zinc-50 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            <LogoutIcon className="h-5 w-5 shrink-0 opacity-80" />
            Logout
          </button>
        </nav>

        {/* CTAs */}
        <div className="mt-auto flex flex-col gap-2.5 px-5 pb-6 pt-2 sticky-action-pad">
          <Link
            href="/dashboard/account"
            onClick={onClose}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 font-display text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-[1.01]"
          >
            ✨ Upgrade
          </Link>
          <Link
            href="/dashboard/teams"
            onClick={onClose}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white px-5 font-display text-sm font-bold text-violet-700 transition-colors hover:bg-violet-50 dark:border-violet-900 dark:bg-zinc-900 dark:text-violet-300 dark:hover:bg-zinc-800"
          >
            <UsersIcon className="h-4 w-4" /> Invite colleagues
          </Link>
          {APP_CONFIG.referralEnabled ? (
            <Link
              href="/dashboard/account#referral"
              onClick={onClose}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white px-5 font-display text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <GiftIcon className="h-4 w-4" /> Gift a Pro week
            </Link>
          ) : null}

          <div className="mt-2 flex items-center justify-between border-t border-zinc-100 px-1 pt-3 dark:border-zinc-800">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <LessonIcon className="h-4 w-4" /> {APP_CONFIG.name}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
