import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));

import { GET } from '@/app/auth/callback/route';
import { createClient } from '@/lib/supabase/server';

type ServerClient = Awaited<ReturnType<typeof createClient>>;

function fakeClient(error: { message: string } | null) {
  const exchangeCodeForSession = vi.fn().mockResolvedValue({ error });
  return { client: { auth: { exchangeCodeForSession } }, exchangeCodeForSession };
}

const locationOf = (res: Response) => res.headers.get('location');

beforeEach(() => {
  vi.mocked(createClient).mockReset();
});

describe('GET /auth/callback', () => {
  it('exchanges a valid code and redirects to the safe next path', async () => {
    const { client } = fakeClient(null);
    vi.mocked(createClient).mockResolvedValue(client as unknown as ServerClient);
    const res = await GET(
      new Request('https://app.test/auth/callback?code=abc&next=/dashboard'),
    );
    expect(locationOf(res)).toBe('https://app.test/dashboard');
  });

  it('redirects to the auth error when no code is present (no exchange)', async () => {
    const res = await GET(
      new Request('https://app.test/auth/callback?next=/dashboard'),
    );
    expect(locationOf(res)).toBe('https://app.test/login?error=auth');
    expect(createClient).not.toHaveBeenCalled();
  });

  it('redirects to the auth error when the code exchange fails', async () => {
    const { client } = fakeClient({ message: 'invalid code' });
    vi.mocked(createClient).mockResolvedValue(client as unknown as ServerClient);
    const res = await GET(
      new Request('https://app.test/auth/callback?code=bad&next=/dashboard'),
    );
    expect(locationOf(res)).toBe('https://app.test/login?error=auth');
  });

  it('never honours an external next (no open redirect)', async () => {
    const { client } = fakeClient(null);
    vi.mocked(createClient).mockResolvedValue(client as unknown as ServerClient);
    const res = await GET(
      new Request('https://app.test/auth/callback?code=abc&next=https://evil.com'),
    );
    expect(locationOf(res)).toBe('https://app.test/dashboard');
  });

  it('handles a provider OAuth error without exchanging a code', async () => {
    const res = await GET(
      new Request(
        'https://app.test/auth/callback?error=access_denied&error_description=user+denied&next=/dashboard',
      ),
    );
    expect(locationOf(res)).toBe('https://app.test/login?error=auth');
    expect(createClient).not.toHaveBeenCalled();
  });

  it('exchanges a valid recovery code and lands on the reset page', async () => {
    const { client } = fakeClient(null);
    vi.mocked(createClient).mockResolvedValue(client as unknown as ServerClient);
    const res = await GET(
      new Request('https://app.test/auth/callback?code=ok&next=/reset-password'),
    );
    expect(locationOf(res)).toBe('https://app.test/reset-password');
  });

  it('sends a missing recovery code to the reset page with an expired flag', async () => {
    const res = await GET(
      new Request('https://app.test/auth/callback?next=/reset-password'),
    );
    expect(locationOf(res)).toBe('https://app.test/reset-password?error=expired');
    expect(createClient).not.toHaveBeenCalled();
  });

  it('sends a failed recovery exchange to the reset page expired view', async () => {
    const { client } = fakeClient({ message: 'expired' });
    vi.mocked(createClient).mockResolvedValue(client as unknown as ServerClient);
    const res = await GET(
      new Request('https://app.test/auth/callback?code=bad&next=/reset-password'),
    );
    expect(locationOf(res)).toBe('https://app.test/reset-password?error=expired');
  });
});
