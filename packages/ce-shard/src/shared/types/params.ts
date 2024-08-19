import * as z from 'zod'
import { EChannel, EFormat } from './enums'

export type EventResult<T> = {
    status: number
    message: string
    data: T
}

export type FileItem = { path: string; content: string }

export type ImportParam = {
    format: EFormat
    date: Date
    content: string
}

export type ImportAllParam = {
    format: EFormat
    fileItems: FileItem[]
}

export type ImportResult = null

export type ExportParam = {
    format: EFormat
    dir: string
}

export type ExportResult = {
    format: EFormat
    fileItems: FileItem[]
}

export type SendMessagePortData = {
    format: EFormat
    channel: EChannel
    toBeImported: boolean
}

export type PickDateAndFormat = {
    date: Date
    format: EFormat
}

export type VerifyImportData = {
    format: EFormat
    content: string
}

export type EditorContentData = {
    format: EFormat
    channel: EChannel
    date: Date
    path: string
    content: string
    contentToBeImported: string
    shouldBeOverridden: boolean
}

export type NotifyParam = {
    message: string
    hasSucceed: boolean
    redirectUrl?: string
}

export const newNotifyParam = (param: NotifyParam) => param

const ImportTypeSchema = z.enum(['OVER_RIDE', 'CREATE', 'COMBINE'])

export type ImportType = z.infer<typeof ImportTypeSchema>

export const FinalImportsDataSchema = z.object({
    toBeOverridden: z.array(
        z.object({
            date: z.string(),
            type: ImportTypeSchema,
            contentToBeOverridden: z.string(),
            contentToBeImported: z.string(),
        })
    ),
    toBeCreated: z.array(
        z.object({
            date: z.string(),
            type: ImportTypeSchema,
            contentToBeImported: z.string(),
        })
    ),
})

export type FinalImportsData = z.infer<typeof FinalImportsDataSchema>

export const FileTypeSchema = z.enum(['file', 'directory'])

export type FileType = z.infer<typeof FileTypeSchema>

export const GetConfigSchema = z.object({ reset: z.boolean() })

export type GetConfig = z.infer<typeof GetConfigSchema>

export const UpdateConfigResultSchema = z.object({ status: z.boolean() })

export type UpdateConfigResult = z.infer<typeof UpdateConfigResultSchema>
