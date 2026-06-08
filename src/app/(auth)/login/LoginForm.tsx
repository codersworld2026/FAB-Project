'use client';

import { useActionState } from 'react';
import { signInAction, type ActionState } from '@/app/auth/actions';
import { SubmitButton } from '@/components/SubmitButton';
import { Alert, Field, Input } from '@/components/ui';

export function LoginForm({
  redirectTo,
  initialError,
}: {
  redirectTo?: string;
  initialError?: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    signInAction,
    initialError ? { error: initialError } : null,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? <Alert variant="error">{state.error}</Alert> : null}
      <input type="hidden" name="redirect" value={redirectTo ?? '/dashboard'} />
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
      <SubmitButton className="w-full" pendingText="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
