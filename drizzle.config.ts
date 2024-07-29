import type { Config } from 'drizzle-kit'

export default {
    schema: './electron/main/database/schema.ts',
    out: './drizzle',
    driver: 'better-sqlite',
    dbCredentials: {
        url: './sqlite.db',
    },
} satisfies Config
