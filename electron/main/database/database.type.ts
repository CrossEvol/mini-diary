import { drizzle } from 'drizzle-orm/better-sqlite3'
import { DiariesTable, ProjectsTable, TodosTable, UsersTable } from './schema'

const user = (db: ReturnType<typeof drizzle>) => {
    return db.select().from(UsersTable).get()!
}

export type UserRecord = ReturnType<typeof user>

const project = (db: ReturnType<typeof drizzle>) => {
    return db.select().from(ProjectsTable).get()!
}

export type ProjectRecord = ReturnType<typeof project>

const diary = (db: ReturnType<typeof drizzle>) => {
    return db.select().from(DiariesTable).get()!
}

export type DiaryRecord = ReturnType<typeof diary>

const todo = (db: ReturnType<typeof drizzle>) => {
    return db.select().from(TodosTable).get()!
}

export type TodoRecord = ReturnType<typeof todo>
