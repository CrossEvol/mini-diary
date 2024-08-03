import { BrowserWindow, dialog } from 'electron'
import { EChannel, Format } from './common/enums'

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
    format: Format
) => {
    const openDialogReturnValue = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    })
    mainWindow?.webContents.send(EChannel.EXPORT_DIARY, [
        format,
        openDialogReturnValue.filePaths[0],
    ])
}

export const exportAllDiariesHandler = async (
    mainWindow: BrowserWindow | null,
    format: Format
) => {
    const openDialogReturnValue = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    })
    mainWindow?.webContents.send(EChannel.EXPORT_ALL_DIARY, [
        format,
        openDialogReturnValue.filePaths[0],
    ])
}

export const importDiaryHandler = async (
    mainWindow: BrowserWindow | null,
    format: Format
) => {
    const openDialogReturnValue = await dialog.showOpenDialog({
        properties: ['openFile'],
    })
    mainWindow?.webContents.send(EChannel.IMPORT_DIARY, [
        format,
        openDialogReturnValue.filePaths[0],
    ])
}
export const importAllDiariesHandler = async (
    mainWindow: BrowserWindow | null,
    format: Format
) => {
    const openDialogReturnValue = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
    })
    mainWindow?.webContents.send(EChannel.IMPORT_ALL_DIARY, [
        format,
        openDialogReturnValue.filePaths,
    ])
}
