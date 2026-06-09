import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Lib unit tests run in Node; component tests opt into jsdom via a
// `// @vitest-environment jsdom` docblock at the top of the file. The `@/*`
// path alias is resolved manually to avoid an extra dependency.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
