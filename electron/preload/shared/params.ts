import { EChannel, EFormat } from './enums'
import * as z from 'zod'

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
    contentToBeDiff: string
}

export type NotifyParam = {
    message: string
    hasSucceed: boolean
    redirectUrl?: string
}

export const newNotifyParam = (param: NotifyParam) => param

export const FinalImportsDataSchema = z.object({
    toBeOverridden: z.array(
        z.object({
            date: z.string(),
            contentToBeOverridden: z.string(),
            contentToBeImported: z.string(),
        })
    ),
    toBeCreated: z.array(
        z.object({
            date: z.string(),
            contentToBeImported: z.string(),
        })
    ),
})

export type FinalImportsData = z.infer<typeof FinalImportsDataSchema>
