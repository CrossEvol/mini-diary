import { EChannel, EFormat } from './enums'

export type EventResult<T> = {
    status: number
    message: string
    data: T
}

export type FileItem = { path: string; content: string }

export type ImportParam = {
    format: EFormat
    filePaths: string[]
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
}

export type PickDateAndFormat = {
    date: Date
    format: EFormat
}

export type EditorContentData = {
    format: EFormat
    channel: EChannel
    path: string
    content: string
}
