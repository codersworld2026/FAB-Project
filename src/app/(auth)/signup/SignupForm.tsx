'use client';

import { useActionState } from 'react';
import { signUpAction, type ActionState } from '@/app/auth/actions';
import { SubmitButton } from '@/components/SubmitButton';
import { Alert, Field, Input } from '@/components/ui';

export function SignupForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    signUpAction,
    null,
  );

  if (state?.success) {
    return <Alert variant="success">{state.success}</Alert>;
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? <Alert variant="error">{state.error}</Alert> : null}
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
      <SubmitButton className="w-full" pendingText="Creating account…">
        Create account
      </SubmitButton>
    </form>
  );
}
