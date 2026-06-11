import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { fetchMutation, fetchQuery } from 'convex/nextjs';
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

  let doc = await fetchQuery(api.profiles.getCurrent, {}, { token });
  // First sign-in: create the profile from the Clerk identity (replaces the old
  // Postgres signup trigger).
  if (!doc) doc = await fetchMutation(api.profiles.ensureProfile, {}, { token });
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
