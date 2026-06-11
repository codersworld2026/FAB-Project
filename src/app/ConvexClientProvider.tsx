'use client';

import { type ReactNode } from 'react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { useAuth } from '@clerk/nextjs';

// Single browser-side Convex client, authenticated via Clerk. Must be rendered
// inside <ClerkProvider> so `useAuth` is available.
//
// Instantiated lazily/guarded: when NEXT_PUBLIC_CONVEX_URL is absent (e.g. during
// static prerendering of /_not-found before the backend env is configured), a
// real ConvexReactClient throws "No address provided" at module load and fails
// the build. With no URL we render children through untouched — the app runs in
// preview mode and all data access is server-side, so no client Convex hooks run.
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) return <>{children}</>;
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
