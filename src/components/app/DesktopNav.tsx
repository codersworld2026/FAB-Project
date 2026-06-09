'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from '@/components/clsx';
import { NAV_ITEMS, isNavActive } from './navItems';

/** Horizontal primary nav for desktop (≥md). Mirrors the mobile drawer items. */
export function DesktopNav() {
  const pathname = usePathname();
  // Account + Support live in the right-hand cluster, so trim them here.
  const items = NAV_ITEMS.filter(
    (i) => i.href !== '/dashboard/account' && i.href !== '/dashboard/support',
  );

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {items.map(({ href, label, Icon }) => {
        const active = isNavActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={clsx(
              'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
              active
                ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50',
            )}
          >
            <Icon className="h-4 w-4 opacity-80" />
            <span className="hidden lg:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
