'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import { APP_CONFIG } from '@/lib/config';
import { LogoMark } from '@/components/landing/MarketingHeader';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DesktopNav } from './DesktopNav';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { Avatar } from './Avatar';
import { MenuIcon } from './icons';

/**
 * App header for the signed-in experience. Mobile: centered wordmark + a
 * hamburger that opens the right-side drawer. Desktop: brand + inline nav +
 * account cluster. Lavender band, sticky, subtle bottom border.
 */
export function AppHeader({
  name,
  email,
  team,
  isOwner = false,
}: {
  name?: string | null;
  email: string;
  team?: string | null;
  isOwner?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { signOut } = useClerk();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-violet-100/80 bg-lavender/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/85">
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Brand — left on desktop, centered on mobile */}
          <Link
            href="/dashboard"
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5 md:static md:left-0 md:translate-x-0"
          >
            <LogoMark />
            <span className="font-display text-base font-extrabold tracking-tight text-zinc-900 sm:text-lg dark:text-zinc-50">
              {APP_CONFIG.name}
            </span>
          </Link>

          <DesktopNav />

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            {isOwner ? (
              <Link
                href="/admin"
                className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-white/70 hover:text-zinc-900 md:inline-flex dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                Admin
              </Link>
            ) : null}
            <Link
              href="/dashboard/account"
              className="hidden items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-white/70 md:inline-flex dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <Avatar name={name} email={email} size="sm" />
              <span className="hidden max-w-[10rem] truncate lg:inline">{name?.trim() || email}</span>
            </Link>
            <button
              type="button"
              onClick={() => signOut({ redirectUrl: '/login' })}
              className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-white/70 hover:text-zinc-900 md:block dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              Sign out
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              aria-haspopup="dialog"
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-zinc-700 transition-colors hover:bg-white/70 active:bg-white md:hidden dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenuDrawer
        open={open}
        onClose={() => setOpen(false)}
        name={name}
        email={email}
        team={team}
        isOwner={isOwner}
      />
    </>
  );
}
