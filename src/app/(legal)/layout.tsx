import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <header className="border-b border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="font-display text-lg font-extrabold tracking-tight text-violet-700 dark:text-violet-300"
          >
            {APP_CONFIG.name}
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <article
          className="text-zinc-700 [&_a]:font-medium [&_a]:text-violet-700 [&_a]:underline [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:text-zinc-900 [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-zinc-900 [&_li]:mt-1 [&_p]:mt-3 [&_p]:text-sm [&_p]:leading-relaxed [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-sm dark:text-zinc-300 dark:[&_a]:text-violet-300 dark:[&_h1]:text-zinc-50 dark:[&_h2]:text-zinc-50"
        >
          {children}
        </article>
      </main>

      <footer className="border-t border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-6 text-sm text-zinc-500 sm:px-6 dark:text-zinc-400">
          <span>
            © {new Date().getFullYear()} {APP_CONFIG.name}
          </span>
          <nav className="flex gap-5">
            <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
