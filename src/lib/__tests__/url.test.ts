import { describe, it, expect } from 'vitest';
import { resolveBaseUrl, type BaseUrlEnv } from '@/lib/url';

/** Build a case-insensitive header accessor from a lowercase-keyed map. */
function headers(values: Record<string, string>) {
  return (name: string) => values[name.toLowerCase()] ?? null;
}
/** A request with NO usable host headers (the failure mode seen on Preview). */
const NO_HEADERS = () => null;

// A realistic Vercel Preview environment. NEXT_PUBLIC_APP_URL is deliberately
// wrong (localhost) to prove it can never win on a deployed runtime.
const PREVIEW: BaseUrlEnv = {
  VERCEL_ENV: 'preview',
  VERCEL_BRANCH_URL: 'fab-project-git-phase-0-au-7c964e-team.vercel.app',
  VERCEL_URL: 'fab-project-jtn1lak23-team.vercel.app',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
};

describe('resolveBaseUrl — request headers are preferred', () => {
  it('uses x-forwarded-host + proto first', () => {
    expect(
      resolveBaseUrl(
        headers({ 'x-forwarded-host': 'preview.vercel.app', 'x-forwarded-proto': 'https' }),
        PREVIEW,
      ),
    ).toBe('https://preview.vercel.app');
  });

  it('falls back to the host header (https inferred) when no forwarded host', () => {
    expect(resolveBaseUrl(headers({ host: 'preview.vercel.app' }), PREVIEW)).toBe(
      'https://preview.vercel.app',
    );
  });

  it('builds an http URL for a localhost host header', () => {
    expect(
      resolveBaseUrl(headers({ host: 'localhost:3000' }), { VERCEL_ENV: 'development' }),
    ).toBe('http://localhost:3000');
  });

  it('falls back to the origin header after host', () => {
    expect(
      resolveBaseUrl(headers({ origin: 'https://preview.vercel.app' }), PREVIEW),
    ).toBe('https://preview.vercel.app');
  });

  it('takes only the first value when forwarded headers are comma-joined', () => {
    expect(
      resolveBaseUrl(
        headers({ 'x-forwarded-host': 'public.example.com, internal', 'x-forwarded-proto': 'https, http' }),
        PREVIEW,
      ),
    ).toBe('https://public.example.com');
  });
});

describe('resolveBaseUrl — Vercel env fallbacks when headers are unavailable', () => {
  it('uses VERCEL_BRANCH_URL on Preview when request headers are unavailable', () => {
    expect(resolveBaseUrl(NO_HEADERS, PREVIEW)).toBe(
      'https://fab-project-git-phase-0-au-7c964e-team.vercel.app',
    );
  });

  it('uses VERCEL_URL as the next fallback when no branch URL is set', () => {
    expect(
      resolveBaseUrl(NO_HEADERS, { VERCEL_ENV: 'production', VERCEL_URL: 'fab-project-prod.vercel.app' }),
    ).toBe('https://fab-project-prod.vercel.app');
  });

  it('NEVER produces a localhost URL on Preview (even with headers missing and NEXT_PUBLIC_APP_URL=localhost)', () => {
    const result = resolveBaseUrl(NO_HEADERS, PREVIEW);
    expect(result).not.toMatch(/localhost/);
  });

  it('NEVER produces a localhost URL on Production', () => {
    const result = resolveBaseUrl(NO_HEADERS, {
      VERCEL_ENV: 'production',
      VERCEL_URL: 'fab-project-prod.vercel.app',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
    });
    expect(result).toBe('https://fab-project-prod.vercel.app');
    expect(result).not.toMatch(/localhost/);
  });

  it('throws rather than emit localhost if a Vercel runtime has no host signal at all', () => {
    expect(() => resolveBaseUrl(NO_HEADERS, { VERCEL_ENV: 'preview' })).toThrow(/non-localhost/i);
  });
});

describe('resolveBaseUrl — configured + local development fallbacks', () => {
  it('uses NEXT_PUBLIC_APP_URL when set and not on a Vercel runtime', () => {
    expect(resolveBaseUrl(NO_HEADERS, { NEXT_PUBLIC_APP_URL: 'https://fab.example' })).toBe(
      'https://fab.example',
    );
  });

  it('uses localhost ONLY in local development (no Vercel env, no headers)', () => {
    expect(resolveBaseUrl(NO_HEADERS, {})).toBe('http://localhost:3000');
  });

  it('strips a trailing slash so callers can append /auth/callback cleanly', () => {
    expect(resolveBaseUrl(NO_HEADERS, { NEXT_PUBLIC_APP_URL: 'https://fab.example/' })).toBe(
      'https://fab.example',
    );
  });
});
