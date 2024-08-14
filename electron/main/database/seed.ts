import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { ProjectsTable, TodosTable, UsersTable } from './schema'

const randomElement = <T>(array: T[]) => {
    const randomIndex = Math.floor(Math.random() * array.length)
    return array[randomIndex]
}

const initialTodos = Array.from({ length: 30 })
    .map((_, idx) => (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`))
    .map((n) =>
        Array.from({ length: 5 }).map((_, idx) => ({
            text: `Item ${idx}`,
            remark: Array.from({ length: 10 })
                .map((_) => Math.floor(Math.random() * 1000_000_000_000_000))
                .map((n) => n.toString(36))
                .join(' '),
            status: randomElement(TodosTable.status.enumValues),
            deadline: new Date(`2024-08-${n}`),
            createdAt: new Date(),
            updatedAt: new Date(),
            priority: randomElement(TodosTable.priority.enumValues),
            createdBy: 1,
        }))
    )
    .flatMap((item) => item)

export const seed = (db: BetterSQLite3Database<Record<string, never>>) => {
    const res = db
        .insert(UsersTable)
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

    db.insert(ProjectsTable)
        .values([
            {
                name: 'Project_' + Date.now().toString(),
                ownerId: userId as number,
            },
        ])
        .run()

    db.insert(TodosTable).values(initialTodos).run()
}
