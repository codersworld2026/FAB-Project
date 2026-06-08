'use client';

import { useState } from 'react';
import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';
import { clsx } from '@/components/clsx';

const NAV = [
  { label: 'Teachers', href: '#features' },
  { label: 'Schools', href: '#how' },
  { label: 'Pricing', href: '#cta' },
  { label: 'Contact us', href: `mailto:${APP_CONFIG.supportEmail}` },
];

export function MarketingHeader({ loggedIn }: { loggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-violet-100/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="text-lg font-bold tracking-tight text-zinc-900">
            {APP_CONFIG.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-violet-700"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:text-violet-700"
          >
            Login
          </Link>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href={loggedIn ? '/dashboard' : '/signup'}
            className="hidden rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700 sm:inline-flex"
          >
            {loggedIn ? 'Dashboard' : 'Sign up free'}
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-zinc-700 hover:bg-violet-50 md:hidden"
          >
            <span className={clsx('block transition', open && 'rotate-90')}>
              {open ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="border-t border-violet-100 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-violet-50"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-violet-50"
            >
              Login
            </Link>
            <Link
              href={loggedIn ? '/dashboard' : '/signup'}
              onClick={() => setOpen(false)}
              className="mt-1 rounded-xl bg-violet-600 px-4 py-2 text-center text-sm font-semibold text-white"
            >
              {loggedIn ? 'Dashboard' : 'Sign up free'}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        'flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm',
        className,
      )}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3l2.2 5.3L20 9.5l-4 3.9.9 5.6L12 16.5 7.1 19l.9-5.6-4-3.9 5.8-1.2L12 3z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}
