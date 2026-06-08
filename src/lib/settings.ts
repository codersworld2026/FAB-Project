import { createClient } from './supabase/server';
import { APP_CONFIG } from './config';

/**
 * Runtime settings reader. Values in the `app_settings` table override the
 * compile-time defaults in `config.ts`. This keeps things like the free-trial
 * limit configurable from the admin area rather than hard-coded.
 *
 * Falls back to config defaults if Supabase isn't configured or the key is
 * missing, so the app never breaks on a missing setting.
 */
export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    if (error || !data) return fallback;
    return data.value as T;
  } catch {
    return fallback;
  }
}

/** Resolved free-trial pack limit (DB → config default). */
export async function getFreeTrialPackLimit(): Promise<number> {
  return getSetting<number>('free_trial_pack_limit', APP_CONFIG.freeTrialPackLimit);
}

/** Resolved default exam board (DB → config default). */
export async function getDefaultExamBoard(): Promise<string> {
  return getSetting<string>('default_exam_board', APP_CONFIG.defaultExamBoard);
}
