import Database from 'better-sqlite3'
import { and, between, count, eq, isNotNull, like, sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { join } from 'path'
import { ErrorCause } from '../server/error'
import { isDev } from '../util/electron.util'
import { TodoRecord } from './database.type'
import { DiariesTable, ProjectsTable, TodosTable, UsersTable } from './schema'

const databasePath = 'sqlite.db'

const sqlite = new Database(
    isDev() ? databasePath : join(process.resourcesPath, databasePath)
)
const db = drizzle(sqlite, { logger: true })

export const getUsersWithProjects = async () => {
    const userWithProjects = db
        .select()
        .from(UsersTable)
        .leftJoin(ProjectsTable, eq(UsersTable.id, ProjectsTable.ownerId))
        .where(sql`${UsersTable.id} = 1`)
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
        .insert(UsersTable)
        .values({ email, nickname, password, pinCode })
        .run()

    if (insertResult.changes === 0) {
        return null
    }

    const newUser = db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.id, insertResult.lastInsertRowid as number))
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
        .update(UsersTable)
        .set({
            email,
            nickname,
            password: !!password ? password : undefined,
            pinCode,
            avatar,
        })
        .where(eq(UsersTable.id, userID))
        .run()
    if (updateResult.changes === 0) {
        return null
    }
    const user = db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.id, userID))
        .get()
    if (!user) throw new Error(ErrorCause.USER_NOT_FOUND)
    return user
}

export const getUserByEmail = async (email: string) => {
    const user = db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.email, email))
        .get()
    return user
}

export const getUserByUserID = async (userID: number) => {
    const user =
        db.select().from(UsersTable).where(eq(UsersTable.id, userID)).get() ??
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
        .from(DiariesTable)
        .where(
            and(
                eq(DiariesTable.ownerId, userId),
                !!start && !!end
                    ? between(DiariesTable.createdAt, start, end)
                    : isNotNull(DiariesTable.createdAt)
            )
        )
        .all()
    return result
}

export const getAllDiaryIDs = async (userID: number) => {
    const result = db
        .select({
            id: DiariesTable.id,
            createdAt: DiariesTable.createdAt,
        })
        .from(DiariesTable)
        .where(eq(DiariesTable.ownerId, userID))
        .all()
    return result
}

export const createDiary = async (
    ownerId: number,
    content: unknown,
    createdAt: Date
) => {
    const insertResult = db
        .insert(DiariesTable)
        .values({
            ownerId,
            createdAt,
            content,
            updatedAt: new Date(),
        })
        .run()
    const newDiary = db
        .select()
        .from(DiariesTable)
        .where(eq(DiariesTable.id, insertResult.lastInsertRowid as number))
        .get()
    return newDiary
}

export const updateDiary = async (id: number, content: unknown) => {
    const result = db
        .update(DiariesTable)
        .set({
            content,
            updatedAt: new Date(),
        })
        .where(eq(DiariesTable.id, id))
        .run()

    if (result.changes === 0) {
        return null
    }
    const diary = db.select().from(DiariesTable).where(eq(DiariesTable.id, id))
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
        .from(TodosTable)
        .where(
            and(
                eq(TodosTable.createdBy, userID),
                !!q ? like(TodosTable.text, `%${q}%`) : undefined,
                !!startDay && !!endDay
                    ? between(TodosTable.deadline, startDay, endDay)
                    : undefined
            )
        )
        .limit(30)
        .offset(0)
        .all()
    return result
}

export const countTodos = (
    userID: number,
    { startDay, endDay, q }: GetTodosParams
) => {
    const result = db
        .select({ count: count() })
        .from(TodosTable)
        .where(
            and(
                eq(TodosTable.createdBy, userID),
                !!q ? like(TodosTable.text, `%${q}%`) : undefined,
                !!startDay && !!endDay
                    ? between(TodosTable.deadline, startDay, endDay)
                    : undefined
            )
        )
        .get()
    if (!result) {
        return 0
    }
    return result.count
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
        .insert(TodosTable)
        .values({
            text,
            remark: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            deadline,
            status: TodosTable.status.enumValues[0],
            priority: TodosTable.priority.enumValues[1],
            createdBy: userID,
        })
        .run()
    if (result.changes === 0) {
        return null
    }
    const newTodo = db
        .select()
        .from(TodosTable)
        .where(eq(TodosTable.id, result.lastInsertRowid as number))
        .get()
    return newTodo!
}

type UpdateTodoParams = Partial<
    Partial<
        Pick<TodoRecord, 'text' | 'remark' | 'status' | 'deadline' | 'priority'>
    >
>

export const updateTodo = (
    todoID: number,
    userID: number,
    params: UpdateTodoParams
) => {
    const updateResult = db
        .update(TodosTable)
        .set({ ...params })
        .where(and(eq(TodosTable.id, todoID), eq(TodosTable.createdBy, userID)))
        .run()
    if (updateResult.changes === 0) {
        return null
    }
    const updatedTodo = db
        .select()
        .from(TodosTable)
        .where(and(eq(TodosTable.id, todoID), eq(TodosTable.createdBy, userID)))
        .get()!
    return updatedTodo
}

export const deleteTodo = (todoID: number, userID: number) => {
    const toBeRemoved = db
        .select()
        .from(TodosTable)
        .where(and(eq(TodosTable.id, todoID), eq(TodosTable.createdBy, userID)))
        .get()
    if (!toBeRemoved) {
        throw new Error(ErrorCause.TODO_NOT_FOUND)
    }
    const deleteResult = db
        .delete(TodosTable)
        .where(and(eq(TodosTable.id, todoID), eq(TodosTable.createdBy, userID)))
        .run()
    if (deleteResult.changes === 0) {
        return null
    }
    return toBeRemoved
}
