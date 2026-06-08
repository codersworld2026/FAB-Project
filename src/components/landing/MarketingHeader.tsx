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
    <header className="sticky top-0 z-30 border-b border-violet-100/70 bg-white/80 shadow-sm shadow-violet-100/40 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <LogoMark />
          <span className="text-base font-bold tracking-tight text-zinc-900 sm:text-lg">
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

        <div className="flex items-center gap-2">
          <Link
            href={loggedIn ? '/dashboard' : '/signup'}
            className="hidden rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-violet-700 sm:inline-flex"
          >
            {loggedIn ? 'Dashboard' : 'Sign up free'}
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-zinc-700 transition-colors hover:bg-violet-50 active:bg-violet-100 md:hidden"
          >
            <BurgerIcon open={open} />
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu (animated open + close) */}
      <div
        className={clsx(
          'overflow-hidden border-violet-100 bg-white/95 backdrop-blur transition-[max-height,opacity] duration-300 ease-out md:hidden',
          open ? 'max-h-[26rem] border-t opacity-100' : 'max-h-0 opacity-0',
        )}
        aria-hidden={!open}
      >
        <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
              className="flex min-h-12 items-center rounded-xl px-3 text-[15px] font-medium text-zinc-700 transition-colors hover:bg-violet-50 active:bg-violet-100"
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="flex min-h-12 items-center rounded-xl px-3 text-[15px] font-medium text-zinc-700 transition-colors hover:bg-violet-50 active:bg-violet-100"
          >
            Login
          </Link>
          <Link
            href={loggedIn ? '/dashboard' : '/signup'}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="mt-1 flex min-h-12 items-center justify-center rounded-xl bg-violet-600 px-4 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
          >
            {loggedIn ? 'Go to dashboard' : 'Sign up free'}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        'flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-sm shadow-violet-300/50',
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

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
