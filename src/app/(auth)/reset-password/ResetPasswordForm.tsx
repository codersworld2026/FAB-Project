'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { resetPasswordAction, type ActionState } from '@/app/auth/actions';
import { SubmitButton } from '@/components/SubmitButton';
import { Alert, Field, Input } from '@/components/ui';

export function ResetPasswordForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(
    resetPasswordAction,
    null,
  );

  if (state?.success) {
    return (
      <div className="space-y-4">
        <Alert variant="success">{state.success}</Alert>
        <Link
          href="/login"
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-violet-800"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.error ? <Alert variant="error">{state.error}</Alert> : null}
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
      <SubmitButton className="w-full" pendingText="Updating password…">
        Update password
      </SubmitButton>
    </form>
  );
}
