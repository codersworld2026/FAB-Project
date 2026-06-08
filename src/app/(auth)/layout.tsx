import Link from 'next/link';
import { APP_CONFIG } from '@/lib/config';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link
          href="/"
          className="mb-8 text-xl font-bold tracking-tight text-violet-700"
        >
          {APP_CONFIG.name}
        </Link>
        <div className="w-full max-w-md">{children}</div>
        <p className="mt-8 text-center text-xs text-zinc-500">
          By continuing you agree to our{' '}
          <Link href="/terms" className="underline hover:text-zinc-700">
            Terms
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-zinc-700">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
