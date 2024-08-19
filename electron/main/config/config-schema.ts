import * as z from 'zod'

const LogSchema = z.object({
    dir: z.string(),
})
// type Log = z.infer<typeof LogSchema>

const SecretSchema = z.object({
    'pri-key': z.string(),
    'pub-key': z.string(),
})
// type Secret = z.infer<typeof SecretSchema>

const SystemSchema = z.object({
    'auto-update': z.boolean(),
    notification: z.boolean(),
})
// type System = z.infer<typeof SystemSchema>

const WindowSchema = z.object({
    width: z.number(),
    height: z.number(),
    resizable: z.boolean(),
    'hide-menu': z.boolean(),
})
// type Window = z.infer<typeof WindowSchema>

const StorageSchema = z.object({
    log: LogSchema,
    secret: SecretSchema,
    database: z.string(),
    images: z.string(),
})
// type Storage = z.infer<typeof StorageSchema>

const UiSchema = z.object({
    theme: z.enum(['system', 'light', 'dark']),
    'main-window': WindowSchema,
    'sub-window': WindowSchema,
})
// type Ui = z.infer<typeof UiSchema>

const ServerSchema = z.object({
    fixed: z.boolean(),
    port: z.number().min(3000).max(8000),
})

export const ConfigSchema = z.object({
    ui: UiSchema,
    storage: StorageSchema,
    system: SystemSchema,
    server: ServerSchema,
})
export type Config = z.infer<typeof ConfigSchema>
