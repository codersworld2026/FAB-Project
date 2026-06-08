'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { clsx } from './clsx';

type Mode = 'light' | 'dark' | 'system';

function systemPrefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyMode(mode: Mode) {
  const isDark = mode === 'dark' || (mode === 'system' && systemPrefersDark());
  const el = document.documentElement;
  el.classList.toggle('dark', isDark);
  el.style.colorScheme = isDark ? 'dark' : 'light';
}

/* External store: the chosen theme lives in localStorage + a window event,
 * so every toggle instance stays in sync without React context. */
function subscribe(onChange: () => void) {
  window.addEventListener('themechange', onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener('themechange', onChange);
    window.removeEventListener('storage', onChange);
  };
}
function getSnapshot(): Mode {
  const v = localStorage.getItem('theme');
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
}
function getServerSnapshot(): Mode {
  return 'system';
}

/**
 * Three-way theme switch: Light · Dark · Auto.
 * "Auto" follows the device's day/night appearance (prefers-color-scheme).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keep the DOM class in sync if the OS flips day↔night while in Auto mode.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystem = () => {
      if (getSnapshot() === 'system') applyMode('system');
    };
    mq.addEventListener('change', onSystem);
    return () => mq.removeEventListener('change', onSystem);
  }, []);

  const choose = (m: Mode) => {
    localStorage.setItem('theme', m);
    applyMode(m);
    window.dispatchEvent(new Event('themechange'));
  };

  const options: { m: Mode; label: string; icon: React.ReactNode }[] = [
    { m: 'light', label: 'Light', icon: <SunIcon /> },
    { m: 'system', label: 'Auto (day/night)', icon: <AutoIcon /> },
    { m: 'dark', label: 'Dark', icon: <MoonIcon /> },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={clsx(
        'inline-flex items-center gap-0.5 rounded-full border border-zinc-200 bg-white/70 p-0.5 shadow-sm backdrop-blur dark:border-zinc-700 dark:bg-zinc-800/70',
        className,
      )}
    >
      {options.map((o) => {
        const active = mode === o.m;
        return (
          <button
            key={o.m}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.label}
            title={o.label}
            onClick={() => choose(o.m)}
            className={clsx(
              'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
              active
                ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
            )}
          >
            {o.icon}
          </button>
        );
      })}
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function AutoIcon() {
  // Half sun / half moon — represents automatic day/night.
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor" />
    </svg>
  );
}
