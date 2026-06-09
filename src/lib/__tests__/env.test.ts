import { describe, it, expect, afterEach, vi } from 'vitest';

// env.ts captures NEXT_PUBLIC_* into `publicEnv` at module load, so each case
// sets process.env first, then re-imports the module. We verify the RUNTIME
// assertion behaviour — NOT that a build fails (builds never require secrets).

const SAVED = { ...process.env };

afterEach(() => {
  process.env = { ...SAVED };
  vi.resetModules();
});

async function loadEnv(overrides: Record<string, string | undefined>) {
  vi.resetModules();
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  return import('../env');
}

describe('environment validation (runtime)', () => {
  it('THROWS in production when Supabase is not configured', async () => {
    const env = await loadEnv({
      VERCEL_ENV: 'production',
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
    });
    expect(() => env.assertSupabaseConfiguredInProduction()).toThrow(
      /not configured in production/i,
    );
  });

  it('returns true in production when Supabase IS configured', async () => {
    const env = await loadEnv({
      VERCEL_ENV: 'production',
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
    });
    expect(env.assertSupabaseConfiguredInProduction()).toBe(true);
  });

  it('does NOT throw outside production when Supabase is missing (preview is allowed)', async () => {
    const env = await loadEnv({
      VERCEL_ENV: 'preview',
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
    });
    expect(env.assertSupabaseConfiguredInProduction()).toBe(false);
  });

  it('requireServerSecret returns the value when present', async () => {
    const env = await loadEnv({ ANTHROPIC_API_KEY: 'sk-test-value' });
    expect(env.requireServerSecret('ANTHROPIC_API_KEY')).toBe('sk-test-value');
  });

  it('requireServerSecret throws naming the variable but NEVER its value', async () => {
    const env = await loadEnv({ ANTHROPIC_API_KEY: undefined });
    try {
      env.requireServerSecret('ANTHROPIC_API_KEY');
      throw new Error('expected requireServerSecret to throw');
    } catch (error) {
      const message = (error as Error).message;
      expect(message).toContain('ANTHROPIC_API_KEY');
      expect(message).not.toContain('sk-test-value');
    }
  });

  it('serverSecretPresence reports booleans only (no values)', async () => {
    const env = await loadEnv({
      SUPABASE_SERVICE_ROLE_KEY: 'super-secret',
      ANTHROPIC_API_KEY: undefined,
    });
    const presence = env.serverSecretPresence();
    expect(presence.SUPABASE_SERVICE_ROLE_KEY).toBe(true);
    expect(presence.ANTHROPIC_API_KEY).toBe(false);
    expect(Object.values(presence).every((v) => typeof v === 'boolean')).toBe(true);
  });
});
