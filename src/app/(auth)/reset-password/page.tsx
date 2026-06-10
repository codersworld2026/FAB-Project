import { redirect } from 'next/navigation';

export const metadata = { title: 'Reset password' };

/**
 * Clerk's password reset is handled entirely on /forgot-password (request a
 * code, then set a new password on the same page). The old Supabase email-link
 * landing page is no longer part of the flow, so send users to the live one.
 */
export default function ResetPasswordPage() {
  redirect('/forgot-password');
}
