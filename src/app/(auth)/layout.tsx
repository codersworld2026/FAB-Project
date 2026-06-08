import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';
import { LogoMark } from '@/components/landing/MarketingHeader';
import { ScienceField } from '@/components/science/ScienceIcons';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b from-violet-100 via-violet-50/50 to-white">
      <div className="bg-lab-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
      <div className="pointer-events-none absolute -right-24 top-0 -z-10 h-80 w-80 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-10 -z-10 h-80 w-80 rounded-full bg-cyan-300/25 blur-3xl" />
      <ScienceField />

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex items-center gap-2.5">
          <LogoMark />
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {APP_CONFIG.name}
          </span>
        </Link>
        <div className="w-full max-w-md">{children}</div>
        <p className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
          By continuing you agree to our{' '}
          <Link href="/terms" className="underline hover:text-violet-700 dark:hover:text-violet-300">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-violet-700 dark:hover:text-violet-300">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
