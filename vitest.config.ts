/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  test: {
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      'e2e/**',
      'electron/main/database/**.ts',
    //   'electron/main/util/jwt.util.spec.ts',
      'packages/**',
      'pages/**'
    ],
    globals: true,
    environment: 'jsdom',
    include: ['**/*.test.{ts,tsx,js,jsx}', '**/*.spec.{ts,tsx,js,jsx}'],
    setupFiles: ['./vitest.setup.ts']
  }
})
