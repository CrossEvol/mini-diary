import type { Config } from 'drizzle-kit';

export default {
	schema: './electron/main/schema.ts',
	out: './drizzle',
	driver: 'better-sqlite',
	dbCredentials: {
		url: './sqlite.db',
	},
} satisfies Config;
