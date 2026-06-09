import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the DB/runtime dependencies so we exercise the pure paywall arithmetic in
// getUsageSummary (used vs limit → remaining/canGenerate, subscriber override).
vi.mock('@/lib/preview', () => ({
  isPreviewMode: () => false,
  PREVIEW_USAGE: {
    used: 0,
    limit: 0,
    remaining: 0,
    status: 'free',
    isSubscribed: false,
    canGenerate: false,
  },
}));
vi.mock('@/lib/supabase/env', () => ({ isSupabaseConfigured: () => true }));
vi.mock('@/lib/settings', () => ({ getFreeTrialPackLimit: vi.fn() }));
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));

import { getUsageSummary } from '@/lib/subscription';
import { createClient } from '@/lib/supabase/server';
import { getFreeTrialPackLimit } from '@/lib/settings';

type CreateClientReturn = Awaited<ReturnType<typeof createClient>>;

/** Minimal chainable Supabase stand-in for the two queries getUsageSummary runs. */
function fakeClient(packCount: number, subStatus: string | null) {
  const packsBuilder = {
    select: () => packsBuilder,
    eq: () => packsBuilder,
    then: (resolve: (r: { count: number }) => void) => resolve({ count: packCount }),
  };
  const subBuilder = {
    select: () => subBuilder,
    eq: () => subBuilder,
    maybeSingle: () =>
      Promise.resolve({ data: subStatus ? { status: subStatus } : null }),
  };
  return {
    auth: { getUser: () => Promise.resolve({ data: { user: { id: 'u1' } } }) },
    from: (table: string) => (table === 'packs' ? packsBuilder : subBuilder),
  };
}

beforeEach(() => {
  vi.mocked(getFreeTrialPackLimit).mockReset();
  vi.mocked(createClient).mockReset();
});

describe('getUsageSummary paywall logic', () => {
  it('allows generation while under the free-trial limit', async () => {
    vi.mocked(getFreeTrialPackLimit).mockResolvedValue(3);
    vi.mocked(createClient).mockResolvedValue(
      fakeClient(1, null) as unknown as CreateClientReturn,
    );
    const usage = await getUsageSummary();
    expect(usage).toMatchObject({
      used: 1,
      limit: 3,
      remaining: 2,
      isSubscribed: false,
      canGenerate: true,
    });
  });

  it('blocks generation once the free-trial limit is reached', async () => {
    vi.mocked(getFreeTrialPackLimit).mockResolvedValue(3);
    vi.mocked(createClient).mockResolvedValue(
      fakeClient(3, null) as unknown as CreateClientReturn,
    );
    const usage = await getUsageSummary();
    expect(usage).toMatchObject({ used: 3, remaining: 0, canGenerate: false });
  });

  it('allows an active subscriber to generate regardless of usage', async () => {
    vi.mocked(getFreeTrialPackLimit).mockResolvedValue(3);
    vi.mocked(createClient).mockResolvedValue(
      fakeClient(10, 'active') as unknown as CreateClientReturn,
    );
    const usage = await getUsageSummary();
    expect(usage).toMatchObject({ isSubscribed: true, canGenerate: true });
  });
});
