// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// Stub Clerk + the router so the client forms render without a ClerkProvider.
vi.mock('@clerk/nextjs/legacy', () => ({
  useSignIn: () => ({
    isLoaded: true,
    signIn: { create: vi.fn(), attemptFirstFactor: vi.fn() },
    setActive: vi.fn(),
  }),
  useSignUp: () => ({
    isLoaded: true,
    signUp: {
      create: vi.fn(),
      prepareEmailAddressVerification: vi.fn(),
      attemptEmailAddressVerification: vi.fn(),
    },
    setActive: vi.fn(),
  }),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

afterEach(cleanup);

import { LoginForm } from '@/app/(auth)/login/LoginForm';
import { SignupForm } from '@/app/(auth)/signup/SignupForm';
import { ForgotPasswordForm } from '@/app/(auth)/forgot-password/ForgotPasswordForm';

describe('email/password forms remain available', () => {
  it('login form renders email + password fields and submit', () => {
    const { container } = render(<LoginForm />);
    expect(container.querySelector('input[name="email"]')).not.toBeNull();
    expect(container.querySelector('input[name="password"]')).not.toBeNull();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('signup form renders name, email + password fields and submit', () => {
    const { container } = render(<SignupForm />);
    expect(container.querySelector('input[name="fullName"]')).not.toBeNull();
    expect(container.querySelector('input[name="email"]')).not.toBeNull();
    expect(container.querySelector('input[name="password"]')).not.toBeNull();
    expect(
      screen.getByRole('button', { name: 'Create account' }),
    ).toBeInTheDocument();
  });

  it('forgot-password form starts on the email request step', () => {
    const { container } = render(<ForgotPasswordForm />);
    expect(container.querySelector('input[name="email"]')).not.toBeNull();
    expect(
      screen.getByRole('button', { name: 'Send reset code' }),
    ).toBeInTheDocument();
  });
});
