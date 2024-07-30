import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import { projectsTable, usersTable } from 'electron/main/database/schema'

const sqlite = new Database('sqlite.db')
const db = drizzle(sqlite)

// this will automatically run needed migrations on the database
migrate(db, { migrationsFolder: './drizzle' })

const seed = () => {
    const res = db
        .insert(usersTable)
        .values([
            {
                nickName: 'User_' + Date.now().toString(),
                password: 'abc123',
                pinCode: '123456',
            },
        ])
        .run()

    const userId = res.lastInsertRowid

    db.insert(projectsTable)
        .values([
            {
                name: 'Project_' + Date.now().toString(),
                ownerId: userId as number,
            },
        ])
        .run()
}

seed()
