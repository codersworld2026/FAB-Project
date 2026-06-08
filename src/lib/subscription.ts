import { createClient } from './supabase/server';
import { isSupabaseConfigured } from './supabase/env';
import { PREVIEW_USAGE, isPreviewMode } from './preview';
import { getFreeTrialPackLimit } from './settings';

export interface UsageSummary {
  used: number;
  limit: number;
  remaining: number;
  status: string;
  isSubscribed: boolean;
  canGenerate: boolean;
}

/**
 * Computes the current teacher's trial/subscription usage. This is the single
 * source of truth for the paywall gate (used by the dashboard now, and to
 * block generation in M6). Only successful generations count against the trial.
 */
export async function getUsageSummary(): Promise<UsageSummary | null> {
  if (isPreviewMode()) return PREVIEW_USAGE;
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [countRes, subRes, limit] = await Promise.all([
    supabase
      .from('packs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('generation_status', 'complete'),
    supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle(),
    getFreeTrialPackLimit(),
  ]);

  const used = countRes.count ?? 0;
  const status = (subRes.data?.status as string) ?? 'free';
  const isSubscribed = status === 'active' || status === 'trialing';
  const remaining = Math.max(0, limit - used);
  const canGenerate = isSubscribed || remaining > 0;

  return { used, limit, remaining, status, isSubscribed, canGenerate };
}
