import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';
import { LogoMark } from './MarketingHeader';

export function MarketingFooter() {
  return (
    <footer className="border-t border-violet-100 bg-violet-50/40 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:px-6 dark:text-zinc-400">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-bold text-zinc-800 dark:text-zinc-100">{APP_CONFIG.name}</span>
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-5">
          <a href="#pack" className="hover:text-violet-700 dark:hover:text-violet-300">What&apos;s included</a>
          <a href="#how" className="hover:text-violet-700 dark:hover:text-violet-300">How it works</a>
          <a href="#departments" className="hover:text-violet-700 dark:hover:text-violet-300">Subjects</a>
          <Link href="/privacy" className="hover:text-violet-700 dark:hover:text-violet-300">Privacy</Link>
          <Link href="/terms" className="hover:text-violet-700 dark:hover:text-violet-300">Terms</Link>
          <a href={`mailto:${APP_CONFIG.supportEmail}`} className="hover:text-violet-700 dark:hover:text-violet-300">
            Contact
          </a>
        </nav>
        <span>© {new Date().getFullYear()} {APP_CONFIG.name}</span>
      </div>
    </footer>
  );
}
