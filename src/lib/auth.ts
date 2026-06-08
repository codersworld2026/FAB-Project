import { redirect } from 'next/navigation';
import { createClient } from './supabase/server';
import { isSupabaseConfigured } from './supabase/env';
import { PREVIEW_PROFILE, isPreviewMode } from './preview';
import type { Profile } from './types';

/** Returns the current auth user, or null. */
export async function getUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Returns the current user's profile row, or null. */
export async function getProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  return (data as Profile) ?? null;
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
