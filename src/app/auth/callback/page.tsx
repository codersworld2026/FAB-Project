'use client';

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

/**
 * Handles the redirect back from a Clerk OAuth flow (Google / Microsoft).
 * Clerk completes the sign-in or sign-up transfer and then forwards the user to
 * the `redirectUrlComplete` passed in `OAuthButtons` (falling back to /dashboard).
 * Replaces the old Supabase `exchangeCodeForSession` route handler.
 */
export default function SSOCallbackPage() {
  return (
    <AuthenticateWithRedirectCallback
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    />
  );
}
