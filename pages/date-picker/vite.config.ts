/// <reference types="vitest" />
import react from '@vitejs/plugin-react-swc'
import * as path from 'path'
import { defineConfig } from 'vite'
import renderer from 'vite-plugin-electron-renderer'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  base: './',
  plugins: [react(), tsconfigPaths(), renderer()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['**/test.{ts,tsx}']
  }
})
