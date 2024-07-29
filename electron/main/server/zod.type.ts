import * as z from 'zod'

export const ProjectsSchema = z.object({
    id: z.number().nullable(),
    name: z.string().nullable(),
    ownerId: z.number().nullable(),
})
export type Projects = z.infer<typeof ProjectsSchema>

export const UsersSchema = z.object({
    id: z.number().nullable(),
    nickName: z.string().nullable(),
    password: z.string().nullable(),
    pinCode: z.string().nullable(),
})
export type Users = z.infer<typeof UsersSchema>

export const UserSchema = z.object({
    users: UsersSchema.nullable(),
    projects: ProjectsSchema.nullable(),
})

export type User = z.infer<typeof UserSchema>

export const DiarySchema = z.object({
    id: z.number().optional(),
    ownerId: z.number().optional(),
    content: z.string().optional(),
    createdAt: z.coerce.date().optional(),
})
export type Diary = z.infer<typeof DiarySchema>
