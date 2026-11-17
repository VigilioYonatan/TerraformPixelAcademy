import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^.*\/vendor\/preact\.mjs$/,
        replacement: 'preact'
      }
    ]
  },
  test: {
    environment: 'jsdom',
    include: ['tests/components/**/*.test.ts'],
    clearMocks: true
  }
});
