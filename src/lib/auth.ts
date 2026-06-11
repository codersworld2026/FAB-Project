import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { fetchMutation } from 'convex/nextjs';
import { api } from '../../convex/_generated/api';
import type { Doc } from '../../convex/_generated/dataModel';
import { isBackendConfigured } from './backend';
import { PREVIEW_PROFILE, isPreviewMode } from './preview';
import type { Profile } from './types';

// Auth is backed by Clerk (identity) + Convex (the profile row). Before the keys
// are present the app should still boot, so we branch on configuration.
const isAuthConfigured = isBackendConfigured;

/** Maps a Convex profile document onto the app's Profile shape. */
function toProfile(doc: Doc<'profiles'>): Profile {
  return {
    id: doc.clerk_id,
    email: doc.email,
    full_name: doc.full_name ?? null,
    school: doc.school ?? null,
    role: doc.role,
    isPlatformAdmin: doc.is_platform_admin === true,
    created_at: new Date(doc._creationTime).toISOString(),
    updated_at: doc.updated_at,
  };
}

/** Returns the current auth user (`{ id }`), or null. */
export async function getUser() {
  if (!isAuthConfigured()) return null;
  const { userId } = await auth();
  return userId ? { id: userId } : null;
}

/** Returns the current user's profile row, or null. */
export async function getProfile(): Promise<Profile | null> {
  if (!isAuthConfigured()) return null;
  const { userId, getToken } = await auth();
  if (!userId) return null;

  const token = await getToken({ template: 'convex' });
  if (!token) return null;

  // Always run ensureProfile during auth bootstrap and use its returned profile.
  // It's idempotent: on first sign-in it creates the profile from the Clerk
  // identity, and on every call it backfills the personal organisation + owner
  // membership for profiles that predate orgs. Calling it only when the profile
  // was missing left those existing-but-membership-less users broken — org-scoped
  // reads (e.g. /dashboard/concepts) then threw "User has no organisation
  // membership."
  const doc = await fetchMutation(api.profiles.ensureProfile, {}, { token });
  return doc ? toProfile(doc) : null;
}

/** Redirects to /login if not authenticated; returns the profile otherwise. */
export async function requireProfile(): Promise<Profile> {
  if (isPreviewMode()) return PREVIEW_PROFILE;
  const profile = await getProfile();
  if (!profile) redirect('/login');
  return profile;
}

/** Redirects non-owners away. Use to guard admin pages/actions. */
export async function requireOwner(): Promise<Profile> {
  if (isPreviewMode()) return PREVIEW_PROFILE;
  const profile = await requireProfile();
  if (profile.role !== 'owner') redirect('/dashboard');
  return profile;
}
