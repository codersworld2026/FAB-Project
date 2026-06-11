import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Lib unit tests run in Node; component tests opt into jsdom via a
// `// @vitest-environment jsdom` docblock at the top of the file. Convex
// function tests live in convex/ and opt into the edge runtime via a
// `// @vitest-environment edge-runtime` docblock (convex-test requirement) —
// the global environment stays `node`. The `@/*` path alias is resolved
// manually to avoid an extra dependency.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}', 'convex/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
