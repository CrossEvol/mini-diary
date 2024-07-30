import Database from 'better-sqlite3'
import { eq, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { diariesTable, projectsTable, usersTable } from './schema'

const sqlite = new Database('./sqlite.db')
const db = drizzle(sqlite)

export const getUsersWithProjects = async () => {
    const userWithProjects = db
        .select()
        .from(usersTable)
        .leftJoin(projectsTable, eq(usersTable.id, projectsTable.ownerId))
        .where(sql`${usersTable.id} = 1`)
        .all()

    const { users, projects } = userWithProjects[0]

    return { ...users, projects: [projects!] }
}

export const createUser = async (
    nickName: string,
    password: string,
    pinCode: string
) => {
    const insertResult = db
        .insert(usersTable)
        .values({ nickName, password, pinCode })
        .run()

    if (insertResult.changes === 0) {
        return null
    }

    const newUser = db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, insertResult.lastInsertRowid as number))
        .get()
    return newUser
}

export const updateUser = async (
    id: number,
    nickName?: string,
    password?: string,
    pinCode?: string,
    avatar?: string
) => {
    const updateResult = db
        .update(usersTable)
        .set({ nickName, password, pinCode, avatar })
        .where(eq(usersTable.id, id))
        .run()
    if (updateResult.changes === 0) {
        return null
    }
    const user = db.select().from(usersTable).where(eq(usersTable.id, id)).get()
    return user
}

export const getUsersByNickname = async (nickname: string) => {
    const users = db
        .select()
        .from(usersTable)
        .where(eq(usersTable.nickName, nickname))
        .all()
    return users
}

export const getAllDiaries = async (userId: number) => {
    const result = db
        .select()
        .from(diariesTable)
        .where(eq(diariesTable.ownerId, userId))
        .all()
    return result
}

export const createDiary = async (ownerId: number, content: unknown) => {
    const insertResult = db
        .insert(diariesTable)
        .values({
            ownerId,
            createdAt: new Date(),
            content,
            updatedAt: new Date(),
        })
        .run()
    const newDiary = db
        .select()
        .from(diariesTable)
        .where(eq(diariesTable.id, insertResult.lastInsertRowid as number))
        .get()
    return newDiary
}

export const updateDiary = async (id: number, content: unknown) => {
    const result = db
        .update(diariesTable)
        .set({
            content,
            updatedAt: new Date(),
        })
        .where(eq(diariesTable.id, id))
        .run()

    if (result.changes !== 0) {
        return null
    }
    const diary = db.select().from(diariesTable).where(eq(diariesTable.id, id))
    return diary
}
