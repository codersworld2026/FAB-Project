'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs/legacy';
import { forgotPasswordSchema, resetPasswordSchema } from '@/lib/validation';
import { clerkErrorMessage, clerkHasErrorCode } from '@/lib/clerk-errors';
import { Alert, Button, Field, Input } from '@/components/ui';

/**
 * Clerk password reset is code-based: request a code by email, then submit the
 * code + a new password on the same page (no separate email-link landing page).
 * To avoid account enumeration we advance to the code step even when the email
 * isn't registered, mirroring the previous "always report success" behaviour.
 */
export function ForgotPasswordForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [stage, setStage] = useState<'request' | 'reset'>('request');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const NEUTRAL_SENT =
    'If that email is registered, a reset code is on its way. Enter it below with your new password.';

  async function handleRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded || !signIn) return;

    const data = new FormData(event.currentTarget);
    const parsed = forgotPasswordSchema.safeParse({ email: data.get('email') });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid email.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: parsed.data.email,
      });
      setInfo(NEUTRAL_SENT);
      setStage('reset');
      setLoading(false);
    } catch (err) {
      // Don't leak whether the email exists — advance with a neutral message.
      if (clerkHasErrorCode(err, 'form_identifier_not_found')) {
        setInfo(NEUTRAL_SENT);
        setStage('reset');
        setLoading(false);
        return;
      }
      setError(clerkErrorMessage(err, 'Could not start the reset. Please try again.'));
      setLoading(false);
    }
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded || !signIn) return;

    const data = new FormData(event.currentTarget);
    const parsed = resetPasswordSchema.safeParse({
      password: data.get('password'),
      confirmPassword: data.get('confirmPassword'),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid password.');
      return;
    }
    const code = String(data.get('code') ?? '').trim();
    if (!code) {
      setError('Enter the code from your email.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password: parsed.data.password,
      });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
        return;
      }
      setError('Additional verification is required.');
      setLoading(false);
    } catch (err) {
      setError(
        clerkErrorMessage(
          err,
          'That code didn’t work or has expired. Request a new one and try again.',
        ),
      );
      setLoading(false);
    }
  }

  if (stage === 'reset') {
    return (
      <form onSubmit={handleReset} className="space-y-4">
        {error ? <Alert variant="error">{error}</Alert> : null}
        {info ? <Alert variant="success">{info}</Alert> : null}
        <Field label="Reset code">
          <Input
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
          />
        </Field>
        <Field label="New password" hint="At least 8 characters.">
          <Input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </Field>
        <Field label="Confirm password">
          <Input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </Field>
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? 'Updating password…' : 'Update password'}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleRequest} className="space-y-4">
      {error ? <Alert variant="error">{error}</Alert> : null}
      <Field label="Email">
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={loading || !isLoaded}
        aria-busy={loading}
      >
        {loading ? 'Sending reset code…' : 'Send reset code'}
      </Button>
    </form>
  );
}
