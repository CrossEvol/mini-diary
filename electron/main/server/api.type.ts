import * as z from 'zod'
import { TodosTable } from '../database/schema'

export const ProjectSchema = z.object({
    id: z.number(),
    name: z.string(),
    ownerId: z.number(),
})
export type Project = z.infer<typeof ProjectSchema>

export const UserSchema = z.object({
    id: z.number(),
    email: z.string(),
    nickname: z.string(),
    password: z.string(),
    pinCode: z.string(),
    avatar: z.string(),
})
export type User = z.infer<typeof UserSchema>

export const UserProfileSchema = UserSchema.omit({ password: true })

export type UserProfile = z.infer<typeof UserProfileSchema>

export const DiarySchema = z.object({
    id: z.number(),
    ownerId: z.number(),
    content: z.string(),
    createdAt: z.date(),
})
export type Diary = z.infer<typeof DiarySchema>

export const UserJoinSchema = UserSchema.extend({
    projects: z.array(ProjectSchema).optional(),
    diaries: z.array(DiarySchema).optional(),
})

export const DiarySyncSchema = z.object({
    content: z.string(),
    createdAt: z.string(),
})

export type DiarySync = z.infer<typeof DiarySyncSchema>

export const DiarySyncOutputSchema = z.object({
    createdCount: z.number(),
    updatedCount: z.number(),
})

export type DiarySyncOutput = z.infer<typeof DiarySyncOutputSchema>

export type UserJoin = z.infer<typeof UserJoinSchema>

export const ZResultSchema = <T>(dataSchema: z.ZodType<T>) =>
    z.object({
        status: z.number(),
        message: z.string(),
        data: dataSchema,
    })

export type ZResult<T> = z.infer<ReturnType<typeof ZResultSchema<T>>>

export const ZPageResultSchema = <T>(dataSchema: z.ZodType<T>) =>
    z.object({
        status: z.number(),
        message: z.string(),
        data: z.object({
            list: z.array(dataSchema),
            current: z.number().optional(),
            per_page: z.number().optional(),
            total_count: z.number(),
        }),
    })

export type ZPageResult<T> = z.infer<ReturnType<typeof ZPageResultSchema<T>>>

export const TodoSchema = z.object({
    id: z.number(),
    text: z.string(),
    remark: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    status: z.enum(TodosTable.status.enumValues),
    deadline: z.date(),
    priority: z.enum(TodosTable.priority.enumValues),
    order: z.number(),
    createdBy: z.number(),
})

export type Todo = z.infer<typeof TodoSchema>

export const GetTodosSchema = z.object({
    q: z.string().optional(),
    startDay: z.string().optional(),
    endDay: z.string().optional(),
    current: z.number().optional(),
    per_page: z.number().optional(),
})

export type GetTodosDTO = z.infer<typeof GetTodosSchema>

export const CreateTodoSchema = z.object({
    text: z.string(),
    deadline: z.string(),
})

export type CreateTodoDTO = z.infer<typeof CreateTodoSchema>

export const UpdateTodoSchema = z
    .object({
        text: z.string(),
        remark: z.string(),
        order: z.number(),
        status: z.enum(TodosTable.status.enumValues),
        deadline: z.string(),
        priority: z.enum(TodosTable.priority.enumValues),
    })
    .partial()

export type UpdateTodoDTO = z.infer<typeof UpdateTodoSchema>
