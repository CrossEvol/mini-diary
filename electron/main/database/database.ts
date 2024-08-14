import Database from 'better-sqlite3'
import { and, between, eq, isNotNull, like, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { join } from 'path'
import { isDev } from '../util/electron.util'
import { TodoRecord } from './database.type'
import { ErrorConstants } from './error'
import { diariesTable, projectsTable, todosTable, usersTable } from './schema'

const databasePath = 'sqlite.db'

const sqlite = new Database(
    isDev() ? databasePath : join(process.resourcesPath, databasePath)
)
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

type CreateUserParams = {
    email: string
    nickname: string
    password: string
    pinCode: string
}

export const createUser = async ({
    email,
    nickname,
    password,
    pinCode,
}: CreateUserParams) => {
    const insertResult = db
        .insert(usersTable)
        .values({ email, nickname, password, pinCode })
        .run()

    if (insertResult.changes === 0) {
        return null
    }

    const newUser = db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, insertResult.lastInsertRowid as number))
        .get()!
    return newUser
}

type UpdateUserParams = {
    email?: string
    nickname?: string
    password?: string
    pinCode?: string
    avatar?: string
}

export const updateUser = async (
    userID: number,
    { email, nickname, password, pinCode, avatar }: UpdateUserParams
) => {
    const updateResult = db
        .update(usersTable)
        .set({
            email,
            nickname,
            password: !!password ? password : undefined,
            pinCode,
            avatar,
        })
        .where(eq(usersTable.id, userID))
        .run()
    if (updateResult.changes === 0) {
        return null
    }
    const user = db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userID))
        .get()
    return user
}

export const getUserByEmail = async (email: string) => {
    const user = db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .get()
    return user
}

export const getUserByUserID = async (userID: number) => {
    const user =
        db.select().from(usersTable).where(eq(usersTable.id, userID)).get() ??
        null
    return user
}

type GetAllDiariesParams = {
    userId: number
    start?: Date
    end?: Date
}

export const getAllDiaries = async ({
    userId,
    start,
    end,
}: GetAllDiariesParams) => {
    const result = db
        .select()
        .from(diariesTable)
        .where(
            and(
                eq(diariesTable.ownerId, userId),
                !!start && !!end
                    ? between(diariesTable.createdAt, start, end)
                    : isNotNull(diariesTable.createdAt)
            )
        )
        .all()
    return result
}

export const getAllDiaryIDs = async (userID: number) => {
    const result = db
        .select({
            id: diariesTable.id,
            createdAt: diariesTable.createdAt,
        })
        .from(diariesTable)
        .where(eq(diariesTable.ownerId, userID))
        .all()
    return result
}

export const createDiary = async (
    ownerId: number,
    content: unknown,
    createdAt: Date
) => {
    const insertResult = db
        .insert(diariesTable)
        .values({
            ownerId,
            createdAt,
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

    if (result.changes === 0) {
        return null
    }
    const diary = db.select().from(diariesTable).where(eq(diariesTable.id, id))
    return diary
}

type GetTodosParams = {
    q?: string
    startDay?: Date
    endDay?: Date
}

export const getAllTodos = (
    userID: number,
    { startDay, endDay, q }: GetTodosParams
) => {
    const result = db
        .select()
        .from(todosTable)
        .where(
            and(
                eq(todosTable.createdBy, userID),
                !!q ? like(todosTable.text, q) : undefined,
                !!startDay && !!endDay
                    ? between(todosTable.deadline, startDay, endDay)
                    : undefined
            )
        )
    return result
}

type CreateTodoParams = {
    text: string
    deadline: Date
}

export const createTodo = (
    userID: number,
    { text, deadline }: CreateTodoParams
) => {
    const result = db
        .insert(todosTable)
        .values({
            text,
            remark: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            deadline,
            status: todosTable.status.enumValues[0],
            priority: todosTable.priority.enumValues[1],
            createdBy: userID,
        })
        .run()
    if (result.changes === 0) {
        return null
    }
    const newTodo = db
        .select()
        .from(todosTable)
        .where(eq(todosTable.id, result.lastInsertRowid as number))
        .get()
    return newTodo
}

type UpdateTodoParams = Partial<
    Pick<TodoRecord, 'text' | 'remark' | 'status' | 'deadline' | 'priority'>
>

export const updateTodo = (todoID: number, params: UpdateTodoParams) => {
    const updateResult = db
        .update(todosTable)
        .set({ ...params })
        .where(eq(todosTable.id, todoID))
        .run()
    if (updateResult.changes === 0) {
        return null
    }
    const updatedTodo = db
        .select()
        .from(todosTable)
        .where(eq(todosTable.id, todoID))
        .get()!
    return updatedTodo
}

export const deleteTodo = (todoID: number) => {
    const target = db
        .select()
        .from(todosTable)
        .where(eq(todosTable.id, todoID))
        .get()
    if (!target) {
        throw new Error(ErrorConstants.SQL_NOT_FOUND)
    }
    const deleteResult = db
        .delete(todosTable)
        .where(eq(todosTable.id, todoID))
        .run()
    if (deleteResult.changes === 0) {
        return null
    }
    return target
}
