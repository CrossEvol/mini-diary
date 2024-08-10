/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import * as path from 'path'
import { defineConfig } from 'vite'
import renderer from 'vite-plugin-electron-renderer'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tsconfigPaths(),
    renderer(),
    visualizer({ open: true, filename: 'ce-stats.html' })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id, {}) => {
          if (id.includes('node_modules')) {
            return 'vendor-imports-diff-box'
          }
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['**/test.{ts,tsx}']
  }
})
