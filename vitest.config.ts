import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Lib-only unit tests run in a Node environment (no DOM). The `@/*` path alias is
// resolved manually here to avoid an extra dependency (vite-tsconfig-paths).
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
