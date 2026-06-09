// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

const signInWithOAuth = vi.fn();
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { signInWithOAuth } }),
}));

import { OAuthButtons } from '@/app/(auth)/OAuthButtons';

beforeEach(() => {
  signInWithOAuth.mockReset();
});

afterEach(cleanup);

describe('OAuthButtons', () => {
  it('renders accessible Google and Microsoft buttons with an email divider', () => {
    render(<OAuthButtons />);
    expect(
      screen.getByRole('button', { name: 'Continue with Google' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Continue with Microsoft' }),
    ).toBeInTheDocument();
    expect(screen.getByText('or continue with email')).toBeInTheDocument();
  });

  it('shows loading and disables BOTH buttons during an active request', async () => {
    // Never resolves → component stays in the loading state.
    signInWithOAuth.mockReturnValue(new Promise(() => {}));
    render(<OAuthButtons />);

    const google = screen.getByRole('button', { name: 'Continue with Google' });
    const microsoft = screen.getByRole('button', { name: 'Continue with Microsoft' });

    fireEvent.click(google);

    expect(await screen.findByText('Redirecting…')).toBeInTheDocument();
    expect(google).toBeDisabled();
    expect(microsoft).toBeDisabled();
    expect(signInWithOAuth).toHaveBeenCalledTimes(1);
  });
});
