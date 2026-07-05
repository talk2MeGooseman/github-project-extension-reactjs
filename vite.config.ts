/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  // Twitch hosts extension assets from a relative path — keep base './'.
  base: './',
  server: {
    port: 8080,
  },
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    server: {
      deps: {
        // Process Primer through Vite so its .css imports don't break Node.
        inline: [/@primer\//],
      },
    },
    coverage: {
      include: ['src/**'],
      // Thresholds sit below current coverage (~97% stmts / ~91% branches) so
      // they catch untested new code without failing on measurement jitter.
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 90,
        lines: 90,
      },
    },
  },
})
