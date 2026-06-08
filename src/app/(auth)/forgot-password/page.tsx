import Link from 'next/link';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { Card } from '@/components/ui';

export const metadata = { title: 'Reset password' };

export default function ForgotPasswordPage() {
  return (
    <Card>
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Reset your password</h1>
      <p className="mt-1 mb-6 text-sm text-zinc-500 dark:text-zinc-400">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <ForgotPasswordForm />
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/login" className="text-violet-700 hover:underline dark:text-violet-300">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
