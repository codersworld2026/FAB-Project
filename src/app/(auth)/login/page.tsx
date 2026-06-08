import Link from 'next/link';
import { LoginForm } from './LoginForm';
import { Card } from '@/components/ui';

export const metadata = { title: 'Sign in' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const { redirect, error } = await searchParams;
  return (
    <Card>
      <h1 className="text-xl font-semibold text-zinc-900">Welcome back</h1>
      <p className="mt-1 mb-6 text-sm text-zinc-500">
        Sign in to generate and manage your lesson packs.
      </p>
      <LoginForm redirectTo={redirect} initialError={error ? 'Please sign in again.' : undefined} />
      <div className="mt-6 flex items-center justify-between text-sm">
        <Link href="/forgot-password" className="text-violet-700 hover:underline">
          Forgot password?
        </Link>
        <Link href="/signup" className="text-violet-700 hover:underline">
          Create an account
        </Link>
      </div>
    </Card>
  );
}
