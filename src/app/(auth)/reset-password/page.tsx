import { ResetPasswordForm } from './ResetPasswordForm';
import { Card } from '@/components/ui';

export const metadata = { title: 'Set new password' };

export default function ResetPasswordPage() {
  return (
    <Card>
      <h1 className="text-xl font-semibold text-zinc-900">Set a new password</h1>
      <p className="mt-1 mb-6 text-sm text-zinc-500">
        Choose a new password for your account.
      </p>
      <ResetPasswordForm />
    </Card>
  );
}
