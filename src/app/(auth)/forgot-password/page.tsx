import Link from 'next/link';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { Card } from '@/components/ui';

export const metadata = { title: 'Reset password' };

export default function ForgotPasswordPage() {
  return (
    <Card>
      <h1 className="text-xl font-semibold text-zinc-900">Reset your password</h1>
      <p className="mt-1 mb-6 text-sm text-zinc-500">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <ForgotPasswordForm />
      <p className="mt-6 text-center text-sm text-zinc-500">
        <Link href="/login" className="text-emerald-700 hover:underline">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
