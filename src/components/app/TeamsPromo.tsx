'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UsersIcon, CloseIcon } from './icons';

/**
 * Dismissible "better together" Teams promo. Session-only dismiss (no fake
 * persistence) — reappears on reload. Original copy, lavender/blush surface.
 */
export function TeamsPromo() {
  const [shown, setShown] = useState(true);
  if (!shown) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-violet-100 bg-blush p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <button
        type="button"
        onClick={() => setShown(false)}
        aria-label="Dismiss"
        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-white/70 hover:text-zinc-600 dark:hover:bg-zinc-800"
      >
        <CloseIcon className="h-5 w-5" />
      </button>

      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-sm shadow-violet-500/30">
        <UsersIcon className="h-6 w-6" />
      </span>
      <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        Better together
      </h3>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
        Create a team, invite Biology colleagues, and share lessons you can remix
        and make your own.
      </p>
      <Link
        href="/dashboard/teams"
        className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 font-display text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-transform hover:scale-[1.02]"
      >
        Create a team
      </Link>
    </div>
  );
}
