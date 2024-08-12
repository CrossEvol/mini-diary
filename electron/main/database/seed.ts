import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { projectsTable, todosTable, usersTable } from './schema'

const randomElement = <T>(array: T[]) => {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}

const initialTodos = Array.from({ length: 30 })
    .map((_, idx) => (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`))
    .map((n) =>
        Array.from({ length: 5 }).map((_, idx) => ({
            text: `Item ${idx}`,
            status: randomElement(todosTable.status.enumValues),
            deadline: new Date(`2024-08-${n}`),
            createdAt: new Date(),
            updatedAt: new Date(),
            priority: randomElement(todosTable.priority.enumValues),
            createdBy: 1,
        }))
    )
    .flatMap((item) => item)

export const seed = (db: BetterSQLite3Database<Record<string, never>>) => {
    const res = db
        .insert(usersTable)
        .values([
            {
                email: '123@qq.com',
                nickname: 'User_' + Date.now().toString(),
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

    db.insert(todosTable).values(initialTodos).run()
}
