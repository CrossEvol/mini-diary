import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { projectsTable, usersTable } from './schema'

export const seed = (db: BetterSQLite3Database<Record<string, never>>) => {
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
