import { describe, it, expect, vi } from 'vitest';
import {
  buildOAuthRedirectTo,
  safeNextPath,
  startOAuth,
  OAUTH_SCOPES,
  type OAuthCapableClient,
} from '@/lib/oauth';

function mockClient() {
  const signInWithOAuth = vi.fn().mockResolvedValue({ error: null });
  const client: OAuthCapableClient = { auth: { signInWithOAuth } };
  return { client, signInWithOAuth };
}

describe('buildOAuthRedirectTo', () => {
  it('builds the callback URL from the given origin (no hard-coded host)', () => {
    expect(buildOAuthRedirectTo('https://app.test', '/dashboard')).toBe(
      'https://app.test/auth/callback?next=%2Fdashboard',
    );
  });

  it('defaults next to /dashboard and works for localhost', () => {
    expect(buildOAuthRedirectTo('http://localhost:3000')).toBe(
      'http://localhost:3000/auth/callback?next=%2Fdashboard',
    );
  });
});

describe('startOAuth', () => {
  it('initiates Google with identity-only scopes', async () => {
    const { client, signInWithOAuth } = mockClient();
    await startOAuth(client, 'google', 'https://app.test', '/dashboard');
    expect(signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'https://app.test/auth/callback?next=%2Fdashboard',
        scopes: 'openid email profile',
      },
    });
  });

  it('initiates Azure (Microsoft) and explicitly requests the email scope', async () => {
    const { client, signInWithOAuth } = mockClient();
    await startOAuth(client, 'azure', 'https://app.test');
    expect(signInWithOAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'azure',
        options: expect.objectContaining({
          scopes: expect.stringContaining('email'),
        }),
      }),
    );
    expect(OAUTH_SCOPES.azure).toContain('email');
  });
});

describe('safeNextPath', () => {
  it('accepts safe internal relative paths', () => {
    expect(safeNextPath('/dashboard')).toBe('/dashboard');
    expect(safeNextPath('/reset-password')).toBe('/reset-password');
    expect(safeNextPath('/dashboard?tab=x#y')).toBe('/dashboard?tab=x#y');
  });

  it('defaults missing or empty values to /dashboard', () => {
    expect(safeNextPath(null)).toBe('/dashboard');
    expect(safeNextPath(undefined)).toBe('/dashboard');
    expect(safeNextPath('')).toBe('/dashboard');
  });

  it('rejects absolute, protocol-relative, backslash and external destinations', () => {
    expect(safeNextPath('https://evil.com')).toBe('/dashboard');
    expect(safeNextPath('http://evil.com/path')).toBe('/dashboard');
    expect(safeNextPath('//evil.com')).toBe('/dashboard');
    expect(safeNextPath('/\\evil.com')).toBe('/dashboard');
    expect(safeNextPath('javascript:alert(1)')).toBe('/dashboard');
    expect(safeNextPath('dashboard')).toBe('/dashboard'); // not path-absolute
  });
});
