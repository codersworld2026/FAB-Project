import { describe, it, expect, vi, beforeEach } from 'vitest';

// The browser/SSR client and request origin are mocked so the actions run as
// pure logic with no network, cookies or request context.
vi.mock('@/lib/supabase/server', () => ({ createClient: vi.fn() }));
vi.mock('@/lib/supabase/env', () => ({ isSupabaseConfigured: vi.fn(() => true) }));
vi.mock('@/lib/url', () => ({
  getRequestBaseUrl: vi.fn().mockResolvedValue('https://app.test'),
}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({ redirect: vi.fn() }));

import {
  signUpAction,
  forgotPasswordAction,
  resetPasswordAction,
} from '@/app/auth/actions';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { getRequestBaseUrl } from '@/lib/url';

type ServerClient = Awaited<ReturnType<typeof createClient>>;

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

function clientWith(auth: Record<string, unknown>) {
  return { auth } as unknown as ServerClient;
}

beforeEach(() => {
  vi.mocked(createClient).mockReset();
  vi.mocked(isSupabaseConfigured).mockReturnValue(true);
});

describe('signUpAction (Gate 1)', () => {
  it('signs up with an origin-derived confirmation link and returns check-email', async () => {
    const signUp = vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null });
    vi.mocked(createClient).mockResolvedValue(clientWith({ signUp }));

    const result = await signUpAction(
      null,
      form({
        fullName: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'supersecret',
        school: 'Analytical School',
      }),
    );

    expect(signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'ada@example.com',
        password: 'supersecret',
        options: expect.objectContaining({
          emailRedirectTo: 'https://app.test/auth/callback',
          data: { full_name: 'Ada Lovelace', school: 'Analytical School' },
        }),
      }),
    );
    expect(result?.success).toMatch(/check your email/i);
    expect(result?.error).toBeUndefined();
  });

  it('passes the resolved Vercel Preview callback to Supabase (never localhost)', async () => {
    const preview = 'https://fab-project-git-phase-0-au-7c964e-team.vercel.app';
    vi.mocked(getRequestBaseUrl).mockResolvedValueOnce(preview);
    const signUp = vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null });
    vi.mocked(createClient).mockResolvedValue(clientWith({ signUp }));

    await signUpAction(
      null,
      form({ fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'supersecret', school: '' }),
    );

    const arg = signUp.mock.calls[0][0] as {
      options: { emailRedirectTo: string };
    };
    expect(arg.options.emailRedirectTo).toBe(`${preview}/auth/callback`);
    expect(arg.options.emailRedirectTo).not.toMatch(/localhost/);
  });

  it('returns the not-configured message when Supabase is missing', async () => {
    vi.mocked(isSupabaseConfigured).mockReturnValue(false);
    const result = await signUpAction(
      null,
      form({ fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'supersecret' }),
    );
    expect(result?.error).toMatch(/not been configured/i);
    expect(createClient).not.toHaveBeenCalled();
  });

  it('rejects an invalid signup before calling Supabase', async () => {
    const signUp = vi.fn();
    vi.mocked(createClient).mockResolvedValue(clientWith({ signUp }));
    const result = await signUpAction(
      null,
      form({ fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'short' }),
    );
    expect(result?.error).toMatch(/at least 8/i);
    expect(signUp).not.toHaveBeenCalled();
  });

  it('does not reveal that an email is already registered (anti-enumeration)', async () => {
    const signUp = vi
      .fn()
      .mockResolvedValue({ data: { user: null }, error: { message: 'User already registered' } });
    vi.mocked(createClient).mockResolvedValue(clientWith({ signUp }));

    const result = await signUpAction(
      null,
      form({ fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'supersecret', school: '' }),
    );
    expect(result?.success).toMatch(/check your email/i);
    expect(result?.error).toBeUndefined();
  });

  it('maps a generic Supabase error to a safe message (no internals leaked)', async () => {
    const signUp = vi
      .fn()
      .mockResolvedValue({ data: { user: null }, error: { message: 'pgcode 500 internal db boom' } });
    vi.mocked(createClient).mockResolvedValue(clientWith({ signUp }));

    const result = await signUpAction(
      null,
      form({ fullName: 'Ada Lovelace', email: 'ada@example.com', password: 'supersecret', school: '' }),
    );
    expect(result?.error).toBe(
      'We could not create your account. Please check your details and try again.',
    );
    expect(result?.error).not.toMatch(/pgcode|db boom/i);
  });
});

describe('forgotPasswordAction (Gate 2)', () => {
  it('requests a reset email with an origin-derived recovery redirect', async () => {
    const resetPasswordForEmail = vi.fn().mockResolvedValue({ data: {}, error: null });
    vi.mocked(createClient).mockResolvedValue(clientWith({ resetPasswordForEmail }));

    const result = await forgotPasswordAction(null, form({ email: 'ada@example.com' }));

    expect(resetPasswordForEmail).toHaveBeenCalledWith('ada@example.com', {
      redirectTo: 'https://app.test/auth/callback?next=/reset-password',
    });
    expect(result?.success).toMatch(/reset link|on its way/i);
  });

  it('reports success even for an unknown email (anti-enumeration)', async () => {
    const resetPasswordForEmail = vi.fn().mockResolvedValue({ data: {}, error: null });
    vi.mocked(createClient).mockResolvedValue(clientWith({ resetPasswordForEmail }));
    const result = await forgotPasswordAction(null, form({ email: 'nobody@example.com' }));
    expect(result?.success).toBeTruthy();
    expect(result?.error).toBeUndefined();
  });
});

describe('resetPasswordAction (Gate 2)', () => {
  it('updates the password and returns a sign-in confirmation', async () => {
    const updateUser = vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null });
    vi.mocked(createClient).mockResolvedValue(clientWith({ updateUser }));

    const result = await resetPasswordAction(
      null,
      form({ password: 'brandnewpass', confirmPassword: 'brandnewpass' }),
    );

    expect(updateUser).toHaveBeenCalledWith({ password: 'brandnewpass' });
    expect(result?.success).toMatch(/password updated|sign in/i);
  });

  it('rejects mismatched passwords WITHOUT calling Supabase', async () => {
    const updateUser = vi.fn();
    vi.mocked(createClient).mockResolvedValue(clientWith({ updateUser }));

    const result = await resetPasswordAction(
      null,
      form({ password: 'brandnewpass', confirmPassword: 'different123' }),
    );

    expect(result?.error).toMatch(/do not match/i);
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('rejects a weak password WITHOUT calling Supabase', async () => {
    const updateUser = vi.fn();
    vi.mocked(createClient).mockResolvedValue(clientWith({ updateUser }));

    const result = await resetPasswordAction(
      null,
      form({ password: 'short', confirmPassword: 'short' }),
    );

    expect(result?.error).toMatch(/at least 8/i);
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('maps a missing recovery session to a friendly expired-link message', async () => {
    const updateUser = vi
      .fn()
      .mockResolvedValue({ data: { user: null }, error: { message: 'Auth session missing!' } });
    vi.mocked(createClient).mockResolvedValue(clientWith({ updateUser }));

    const result = await resetPasswordAction(
      null,
      form({ password: 'brandnewpass', confirmPassword: 'brandnewpass' }),
    );

    expect(result?.error).toMatch(/expired|request a new/i);
    expect(result?.error).not.toMatch(/Auth session missing/);
  });
});
