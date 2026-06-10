import { describe, it, expect } from 'vitest';
import { baseUrlFromHeaders } from '@/lib/url';

/** Build a case-insensitive header accessor from a lowercase-keyed map. */
function headers(values: Record<string, string>) {
  return (name: string) => values[name.toLowerCase()] ?? null;
}

describe('baseUrlFromHeaders', () => {
  it('prefers x-forwarded-host + proto (Vercel/proxy)', () => {
    expect(
      baseUrlFromHeaders(
        headers({
          'x-forwarded-host': 'fab-project-git-feature.vercel.app',
          'x-forwarded-proto': 'https',
        }),
      ),
    ).toBe('https://fab-project-git-feature.vercel.app');
  });

  it('falls back to the origin header when no forwarded host is present', () => {
    expect(
      baseUrlFromHeaders(headers({ origin: 'https://fab-project.vercel.app' })),
    ).toBe('https://fab-project.vercel.app');
  });

  it('builds an http URL for a localhost host header', () => {
    expect(baseUrlFromHeaders(headers({ host: 'localhost:3000' }))).toBe(
      'http://localhost:3000',
    );
  });

  it('assumes https for a non-local host header', () => {
    expect(baseUrlFromHeaders(headers({ host: 'fab-project.vercel.app' }))).toBe(
      'https://fab-project.vercel.app',
    );
  });

  it('takes only the first value when forwarded headers are comma-joined', () => {
    expect(
      baseUrlFromHeaders(
        headers({
          'x-forwarded-host': 'public.example.com, internal.local',
          'x-forwarded-proto': 'https, http',
        }),
      ),
    ).toBe('https://public.example.com');
  });

  it('uses the explicit fallback when no header identifies the host', () => {
    expect(baseUrlFromHeaders(headers({}), 'https://fallback.example')).toBe(
      'https://fallback.example',
    );
  });

  it('strips a trailing slash so callers can append /auth/callback cleanly', () => {
    expect(
      baseUrlFromHeaders(headers({}), 'https://fallback.example/'),
    ).toBe('https://fallback.example');
  });
});
