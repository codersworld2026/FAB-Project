/**
 * Environment access + validation.
 *
 * Two classes of variables, kept strictly separate:
 *   - PUBLIC  (NEXT_PUBLIC_*): browser-safe; inlined at build time.
 *   - SECRET  (server-only):  read only inside server code, only when the feature
 *                             that needs them actually executes.
 *
 * VALIDATION TIMING (deliberate, see docs/deployment-environments.md):
 *   - NOTHING is validated at import / module-eval / build time. `next build`
 *     therefore succeeds in CI and on Vercel preview WITHOUT any production
 *     secrets.
 *   - In the PRODUCTION runtime, `assertSupabaseConfiguredInProduction()` is
 *     called on the request path before auth/DB work. If the Supabase config is
 *     missing in production it THROWS — production must never silently fall back
 *     to the owner-preview experience (see src/lib/preview.ts).
 *   - Feature secrets (Anthropic, Stripe) are required only at the point of use
 *     via `requireServerSecret`.
 *
 * Secrets are NEVER logged. This module exposes presence booleans, not values.
 */

import { ConfigError } from './errors';

// ---- Public (browser-safe) configuration -----------------------------------
export const publicEnv = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Lessons Generator',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@example.com',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
} as const;

// ---- Environment detection --------------------------------------------------
/** True only in the real production runtime (Vercel `production`, else NODE_ENV). */
export function isProductionRuntime(): boolean {
  // On Vercel, VERCEL_ENV is 'production' | 'preview' | 'development'.
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === 'production';
  return process.env.NODE_ENV === 'production';
}

/** Whether the public Supabase config required for auth/DB access is present. */
export function hasSupabasePublicConfig(): boolean {
  return publicEnv.supabaseUrl.length > 0 && publicEnv.supabaseAnonKey.length > 0;
}

// ---- Runtime assertions (server-side; never at build) -----------------------
/**
 * Call on the server request path before any auth/DB-dependent work.
 *
 *   - Returns true when Supabase is configured.
 *   - In PRODUCTION with Supabase missing: THROWS (so preview-as-owner can never
 *     activate in prod).
 *   - Outside production with Supabase missing: returns false, so callers may
 *     keep the graceful local/preview behaviour.
 */
export function assertSupabaseConfiguredInProduction(): boolean {
  if (hasSupabasePublicConfig()) return true;
  if (isProductionRuntime()) {
    throw new ConfigError(
      'Supabase is not configured in production. Refusing to serve requests without authentication.',
    );
  }
  return false;
}

export type ServerSecretName =
  | 'SUPABASE_SERVICE_ROLE_KEY'
  | 'ANTHROPIC_API_KEY'
  | 'STRIPE_SECRET_KEY'
  | 'STRIPE_WEBHOOK_SECRET';

/**
 * Read a required server-only secret at the point of use. Throws a ConfigError
 * naming the variable (NEVER its value) when absent. Use ONLY in server code, and
 * only inside the feature that needs the secret.
 */
export function requireServerSecret(name: ServerSecretName): string {
  const value = process.env[name];
  if (!value) {
    throw new ConfigError(`Missing required server configuration: ${name}`);
  }
  return value;
}

/** Presence-only view of server secrets for diagnostics (no values, ever). */
export function serverSecretPresence(): Record<ServerSecretName, boolean> {
  return {
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    ANTHROPIC_API_KEY: Boolean(process.env.ANTHROPIC_API_KEY),
    STRIPE_SECRET_KEY: Boolean(process.env.STRIPE_SECRET_KEY),
    STRIPE_WEBHOOK_SECRET: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
  };
}
