import Link from 'next/link';
import { SignupForm } from './SignupForm';
import { Card } from '@/components/ui';

export const metadata = { title: 'Create account' };

export default function SignupPage() {
  return (
    <Card>
      <h1 className="text-xl font-semibold text-zinc-900">Create your account</h1>
      <p className="mt-1 mb-6 text-sm text-zinc-500">
        Start your free trial. No student data is ever collected.
      </p>
      <SignupForm />
      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="text-emerald-700 hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
