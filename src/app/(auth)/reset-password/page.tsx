import Link from 'next/link';
import { ResetPasswordForm } from './ResetPasswordForm';
import { Card } from '@/components/ui';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const metadata = { title: 'Set new password' };

/**
 * Recovery-session guard. The reset link routes through `/auth/callback`, which
 * exchanges the one-time code and sets the session cookie before sending the
 * user here. If there is no recovery session (expired/invalid link, or the
 * callback bounced with `?error=`), we never show the form — instead we offer a
 * clear path to request a fresh link rather than leaking a raw auth error.
 */
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  let hasRecoverySession = false;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    hasRecoverySession = Boolean(user);
  }

  if (error || !hasRecoverySession) {
    return (
      <Card>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Reset link invalid or expired
        </h1>
        <p className="mt-1 mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          This password-reset link is no longer valid. Request a new one and
          we’ll email you a fresh link.
        </p>
        <Link
          href="/forgot-password"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-violet-800"
        >
          Request a new link
        </Link>
        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link
            href="/login"
            className="text-violet-700 hover:underline dark:text-violet-300"
          >
            Back to sign in
          </Link>
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        Set a new password
      </h1>
      <p className="mt-1 mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Choose a new password for your account.
      </p>
      <ResetPasswordForm />
    </Card>
  );
}
