'use client';

import { useActionState } from 'react';
import { forgotPasswordAction, type ActionState } from '@/app/auth/actions';
import { SubmitButton } from '@/components/SubmitButton';
import { Alert, Field, Input } from '@/components/ui';

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    forgotPasswordAction,
    null,
  );

  if (state?.success) {
    return <Alert variant="success">{state.success}</Alert>;
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? <Alert variant="error">{state.error}</Alert> : null}
      <Field label="Email">
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <SubmitButton className="w-full" pendingText="Sending reset link…">
        Send reset link
      </SubmitButton>
    </form>
  );
}
