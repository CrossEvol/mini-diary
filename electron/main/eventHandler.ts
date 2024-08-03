import { BrowserWindow, dialog } from 'electron'
import { readFile } from 'node:fs/promises'
import { EChannel, EFormat } from './common/enums'
import { ExportParam, FileItem, ImportParam } from './common/params'

// TODO wait for worker bundle
/* export let port = 0

export const handlePortFromWorkerThread = (
    event: IpcMainEvent,
    message: string
) => {
    port = (event as any).port
} */

export const exportDiaryHandler = async (
    mainWindow: BrowserWindow | null,
    format: EFormat
) => {
    const openDialogReturnValue = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    })
    mainWindow?.webContents.send(EChannel.EXPORT_DIARY, {
        format,
        dir: openDialogReturnValue.filePaths[0],
    } as ExportParam)
}

export const exportAllDiariesHandler = async (
    mainWindow: BrowserWindow | null,
    format: EFormat
) => {
    const openDialogReturnValue = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    })
    mainWindow?.webContents.send(EChannel.EXPORT_ALL_DIARY, {
        format,
        dir: openDialogReturnValue.filePaths[0],
    } as ExportParam)
}

export const importDiaryHandler = async (
    mainWindow: BrowserWindow | null,
    format: EFormat
) => {
    const openDialogReturnValue = await dialog.showOpenDialog({
        properties: ['openFile'],
    })
    const fileItems = await Promise.all(
        openDialogReturnValue.filePaths.map(async (path) => {
            const content = await readFile(path, { encoding: 'utf-8' })
            return { path, content } as FileItem
        })
    )
    mainWindow?.webContents.send(EChannel.IMPORT_DIARY, {
        format,
        filePaths: openDialogReturnValue.filePaths,
        fileItems,
    } as ImportParam)
}
export const importAllDiariesHandler = async (
    mainWindow: BrowserWindow | null,
    format: EFormat
) => {
    const openDialogReturnValue = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
    })
    const fileItems = await Promise.all(
        openDialogReturnValue.filePaths.map(async (path) => {
            const content = await readFile(path, { encoding: 'utf-8' })
            return { path, content } as FileItem
        })
    )
    mainWindow?.webContents.send(EChannel.IMPORT_ALL_DIARY, {
        format,
        filePaths: openDialogReturnValue.filePaths,
        fileItems,
    } as ImportParam)
}
