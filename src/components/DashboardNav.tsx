'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOutAction } from '@/app/auth/actions';
import { APP_CONFIG } from '@/lib/config';
import { LogoMark } from '@/components/landing/MarketingHeader';
import { ThemeToggle } from '@/components/ThemeToggle';
import { clsx } from './clsx';

interface NavItem {
  href: string;
  label: string;
}

export function DashboardNav({
  email,
  isOwner,
}: {
  email: string;
  isOwner: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/generate', label: 'New pack' },
    { href: '/dashboard/account', label: 'Account' },
    ...(isOwner ? [{ href: '/admin', label: 'Admin' }] : []),
  ];

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/85 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5"
          >
            <LogoMark />
            <span className="hidden text-lg font-bold tracking-tight text-zinc-900 sm:inline dark:text-zinc-50">
              {APP_CONFIG.name}
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden max-w-[16rem] truncate text-sm text-zinc-500 lg:inline dark:text-zinc-400">
            {email}
          </span>
          <ThemeToggle className="hidden sm:inline-flex" />
          <form action={signOutAction} className="hidden md:block">
            <button
              type="submit"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              Sign out
            </button>
          </form>

          {/* Mobile menu toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100 md:hidden dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open ? (
        <div className="border-t border-zinc-200 bg-white md:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  'rounded-lg px-3 py-2 text-sm font-medium',
                  isActive(item.href)
                    ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
                    : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800',
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between gap-3 border-t border-zinc-100 px-3 pt-3 dark:border-zinc-800">
              <ThemeToggle />
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Sign out
                </button>
              </form>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
