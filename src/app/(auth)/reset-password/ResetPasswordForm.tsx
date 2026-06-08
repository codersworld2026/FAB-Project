'use client';

import { useActionState } from 'react';
import { resetPasswordAction, type ActionState } from '@/app/auth/actions';
import { SubmitButton } from '@/components/SubmitButton';
import { Alert, Field, Input } from '@/components/ui';

export function ResetPasswordForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    resetPasswordAction,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? <Alert variant="error">{state.error}</Alert> : null}
      <Field label="New password">
        <Input
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </Field>
      <SubmitButton className="w-full" pendingText="Saving…">
        Save new password
      </SubmitButton>
    </form>
  );
}
