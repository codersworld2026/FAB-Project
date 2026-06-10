import { describe, it, expect } from 'vitest';
import { OAUTH_LABELS, OAUTH_STRATEGY, safeNextPath } from '@/lib/oauth';

describe('OAuth provider config', () => {
  it('maps each provider to its Clerk OAuth strategy', () => {
    expect(OAUTH_STRATEGY.google).toBe('oauth_google');
    expect(OAUTH_STRATEGY.microsoft).toBe('oauth_microsoft');
  });

  it('has a human label per provider', () => {
    expect(OAUTH_LABELS.google).toMatch(/google/i);
    expect(OAUTH_LABELS.microsoft).toMatch(/microsoft/i);
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
