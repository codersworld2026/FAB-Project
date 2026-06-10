'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { getRequestBaseUrl } from '@/lib/url';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from '@/lib/validation';

export type ActionState = {
  error?: string;
  success?: string;
} | null;

const NOT_CONFIGURED =
  'Sign-in is not available yet — the database/auth keys have not been configured. See README.';

const CHECK_EMAIL =
  'Account created. Check your email to confirm your address, then sign in.';

/** True when Supabase signals the email already has an account. */
function isAlreadyRegistered(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes('already registered') ||
    m.includes('already exists') ||
    m.includes('already been registered')
  );
}

/** Map a Supabase sign-up error to a safe, user-facing message (no internals). */
function friendlySignUpError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('password')) {
    return 'Please choose a stronger password (at least 8 characters).';
  }
  if (m.includes('rate') || m.includes('too many') || m.includes('limit')) {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }
  if (m.includes('email') && m.includes('invalid')) {
    return 'Enter a valid email address.';
  }
  return 'We could not create your account. Please check your details and try again.';
}

/** Map a Supabase password-update error to a safe, user-facing message. */
function friendlyResetError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('session') || m.includes('jwt') || m.includes('token')) {
    return 'Your reset link has expired. Request a new one and try again.';
  }
  if (m.includes('different') || m.includes('same')) {
    return 'Choose a password different from your current one.';
  }
  if (m.includes('password')) {
    return 'Please choose a stronger password (at least 8 characters).';
  }
  return 'We could not update your password. Request a new reset link and try again.';
}

export async function signInAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };

  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid details.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: 'Incorrect email or password.' };

  const redirectTo = (formData.get('redirect') as string) || '/dashboard';
  revalidatePath('/', 'layout');
  redirect(redirectTo);
}

export async function signUpAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };

  const parsed = signUpSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    school: formData.get('school'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid details.' };
  }

  // Build the confirmation link from THIS request's origin so it works on
  // localhost, Vercel Preview and production (not a static build-time URL).
  const base = await getRequestBaseUrl();
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${base}/auth/callback`,
      data: {
        full_name: parsed.data.fullName,
        school: parsed.data.school ?? '',
      },
    },
  });
  if (error) {
    // Never confirm that an address already exists — respond as for a new signup.
    if (isAlreadyRegistered(error.message)) return { success: CHECK_EMAIL };
    return { error: friendlySignUpError(error.message) };
  }

  return { success: CHECK_EMAIL };
}

export async function signOutAction() {
  if (!isSupabaseConfigured()) redirect('/');
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function forgotPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };

  const parsed = forgotPasswordSchema.safeParse({ email: formData.get('email') });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid email.' };
  }

  // Recovery link routes through the hardened callback (which exchanges the
  // code and sets the session) then on to the reset page — built from the live
  // request origin so it is valid on localhost, Preview and production.
  const base = await getRequestBaseUrl();
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${base}/auth/callback?next=/reset-password`,
  });

  // Always report success to avoid leaking which emails are registered.
  return {
    success:
      'If that email is registered, a password-reset link is on its way.',
  };
}

export async function resetPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: NOT_CONFIGURED };

  const parsed = resetPasswordSchema.safeParse({
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid password.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) return { error: friendlyResetError(error.message) };

  // Confirm in place and send the user to sign in — never strand them on a
  // blank callback page.
  return {
    success: 'Password updated. You can now sign in with your new password.',
  };
}
