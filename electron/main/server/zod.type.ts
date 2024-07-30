import * as z from 'zod'

export const ProjectSchema = z.object({
    id: z.number().nullable(),
    name: z.string().nullable(),
    ownerId: z.number().nullable(),
})
export type Project = z.infer<typeof ProjectSchema>

export const UserSchema = z.object({
    id: z.number().nullable(),
    nickName: z.string().nullable(),
    password: z.string().nullable(),
    pinCode: z.string().nullable(),
    avatar: z.string().nullable(),
})
export type User = z.infer<typeof UserSchema>

export const DiarySchema = z.object({
    id: z.number().optional(),
    ownerId: z.number().optional(),
    content: z.string().optional(),
    createdAt: z.coerce.date().optional(),
})
export type Diary = z.infer<typeof DiarySchema>

export const UserJoinSchema = UserSchema.extend({
    projects: z.array(ProjectSchema).optional(),
    diaries: z.array(DiarySchema).optional(),
})
