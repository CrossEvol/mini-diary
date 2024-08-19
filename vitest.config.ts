/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        include: ['**/*.test.{ts,tsx,js,jsx}','**/*.spec.{ts,tsx,js,jsx}'],
        setupFiles: ['./vitest.setup.ts'],
    },
})
