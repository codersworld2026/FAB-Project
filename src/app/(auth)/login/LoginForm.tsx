'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs/legacy';
import { signInSchema } from '@/lib/validation';
import { Alert, Button, Field, Input } from '@/components/ui';

export function LoginForm({
  redirectTo,
  initialError,
}: {
  redirectTo?: string;
  initialError?: string;
}) {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded || !signIn) return;

    const data = new FormData(event.currentTarget);
    const parsed = signInSchema.safeParse({
      email: data.get('email'),
      password: data.get('password'),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid details.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: parsed.data.email,
        password: parsed.data.password,
      });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push(redirectTo || '/dashboard');
        return;
      }
      // Email/password is single-factor here; anything else means extra steps
      // we don't support in this UI.
      setError('Additional verification is required to sign in.');
      setLoading(false);
    } catch {
      // Never reveal which half was wrong.
      setError('Incorrect email or password.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? <Alert variant="error">{error}</Alert> : null}
      <Field label="Email">
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password">
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </Field>
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={loading || !isLoaded}
        aria-busy={loading}
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
