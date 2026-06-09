// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Stub the server actions so the client forms render without server-only imports.
vi.mock('@/app/auth/actions', () => ({
  signInAction: vi.fn(),
  signUpAction: vi.fn(),
}));

afterEach(cleanup);

import { LoginForm } from '@/app/(auth)/login/LoginForm';
import { SignupForm } from '@/app/(auth)/signup/SignupForm';

describe('email/password forms remain available', () => {
  it('login form still renders email + password fields and submit', () => {
    const { container } = render(<LoginForm />);
    expect(container.querySelector('input[name="email"]')).not.toBeNull();
    expect(container.querySelector('input[name="password"]')).not.toBeNull();
    expect(
      screen.getByRole('button', { name: 'Sign in' }),
    ).toBeInTheDocument();
  });

  it('signup form still renders email + password fields and submit', () => {
    const { container } = render(<SignupForm />);
    expect(container.querySelector('input[name="email"]')).not.toBeNull();
    expect(container.querySelector('input[name="password"]')).not.toBeNull();
    expect(
      screen.getByRole('button', { name: 'Create account' }),
    ).toBeInTheDocument();
  });
});
