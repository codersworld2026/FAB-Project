'use client';

import { useFormStatus } from 'react-dom';
import { Button } from './ui';

/**
 * Submit button that shows a pending state and disables itself while the form
 * action runs — prevents duplicate submissions.
 */
export function SubmitButton({
  children,
  pendingText,
  className,
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={className}>
      {pending ? (pendingText ?? 'Please wait…') : children}
    </Button>
  );
}
