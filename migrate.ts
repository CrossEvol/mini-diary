import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { seed } from 'electron/main/database/seed'

const sqlite = new Database('sqlite.db')
const db = drizzle(sqlite)

// this will automatically run needed migrations on the database
migrate(db, { migrationsFolder: './drizzle' })

seed(db)
