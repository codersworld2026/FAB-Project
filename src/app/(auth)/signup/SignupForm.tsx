'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSignUp } from '@clerk/nextjs/legacy';
import { signUpSchema } from '@/lib/validation';
import { clerkErrorMessage } from '@/lib/clerk-errors';
import { Alert, Button, Field, Input } from '@/components/ui';

const CREATE_FAILED =
  'We could not create your account. Please check your details and try again.';
const CODE_FAILED =
  'That code didn’t work or has expired. Check your email and try again.';

export function SignupForm() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded || !signUp) return;

    const data = new FormData(event.currentTarget);
    const parsed = signUpSchema.safeParse({
      fullName: data.get('fullName'),
      email: data.get('email'),
      password: data.get('password'),
      school: data.get('school'),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid details.');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await signUp.create({
        emailAddress: parsed.data.email,
        password: parsed.data.password,
        // full_name / school aren't standard Clerk fields; stash them for the
        // profile sync (read via a custom JWT claim, or a later webhook).
        unsafeMetadata: {
          full_name: parsed.data.fullName,
          school: parsed.data.school || '',
        },
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerifying(true);
      setLoading(false);
    } catch (err) {
      setError(clerkErrorMessage(err, CREATE_FAILED));
      setLoading(false);
    }
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isLoaded || !signUp) return;

    setError(null);
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
        return;
      }
      setError(CODE_FAILED);
      setLoading(false);
    } catch (err) {
      setError(clerkErrorMessage(err, CODE_FAILED));
      setLoading(false);
    }
  }

  if (verifying) {
    return (
      <form onSubmit={handleVerify} className="space-y-4">
        {error ? <Alert variant="error">{error}</Alert> : null}
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          We emailed you a 6-digit code. Enter it to finish creating your account.
        </p>
        <Field label="Verification code">
          <Input
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
          {loading ? 'Verifying…' : 'Verify email'}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleCreate} className="space-y-4">
      {error ? <Alert variant="error">{error}</Alert> : null}
      <Field label="Full name">
        <Input name="fullName" type="text" autoComplete="name" required />
      </Field>
      <Field label="School (optional)">
        <Input name="school" type="text" autoComplete="organization" />
      </Field>
      <Field label="Email">
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password" hint="At least 8 characters.">
        <Input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>
      {/* Clerk bot-protection mounts here when enabled for the instance. */}
      <div id="clerk-captcha" />
      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={loading || !isLoaded}
        aria-busy={loading}
      >
        {loading ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}
