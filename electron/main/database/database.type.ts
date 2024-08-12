import Database from 'better-sqlite3'
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { diariesTable, projectsTable, todosTable, usersTable } from './schema'

const user = (db: ReturnType<typeof drizzle>) => {
    return db.select().from(usersTable).get()!
}

export type UserRecord = ReturnType<typeof user>

const project = (db: ReturnType<typeof drizzle>) => {
    return db.select().from(projectsTable).get()!
}

export type ProjectRecord = ReturnType<typeof project>

const diary = (db: ReturnType<typeof drizzle>) => {
    return db.select().from(diariesTable).get()!
}

export type DiaryRecord = ReturnType<typeof diary>

const todo = (db: ReturnType<typeof drizzle>) => {
    return db.select().from(todosTable).get()!
}

export type TodoRecord = ReturnType<typeof todo>
