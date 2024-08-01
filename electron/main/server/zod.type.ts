import * as z from 'zod'

export const ProjectSchema = z.object({
    id: z.number().nullable(),
    name: z.string().nullable(),
    ownerId: z.number().nullable(),
})
export type Project = z.infer<typeof ProjectSchema>

export const UserSchema = z.object({
    id: z.number().nullable(),
    email: z.string().nullable(),
    nickname: z.string().nullable(),
    password: z.string().nullable(),
    pinCode: z.string().nullable(),
    avatar: z.string().nullable(),
})
export type User = z.infer<typeof UserSchema>

export const DiarySchema = z.object({
    id: z.number(),
    ownerId: z.number(),
    content: z.string(),
    createdAt: z.date().nullable(),
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

export const ResultSchema = <T>(dataSchema: z.ZodType<T>) =>
    z.object({
        status: z.number(),
        message: z.string(),
        data: dataSchema,
    })

export type Result<T> = z.infer<ReturnType<typeof ResultSchema<T>>>
