import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
    './vitest.config.ts',
    './pages/imports-diff-box/vitest.config.ts',
    './pages/date-picker/vite.config.ts',
    './packages/ce-utils/vitest.config.ts',
])
