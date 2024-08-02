import {
    BrowserWindow,
    IpcMainEvent,
    IpcMainInvokeEvent,
    dialog,
} from 'electron'
import { Format } from './common/enums'

let port = 0

export const handlePortFromWorkerThread = (
    event: IpcMainEvent,
    message: string
) => {
    port = (event as any).port
}

export const handleReceiveTwoWayMessage = (
    event: IpcMainInvokeEvent,
    message: string
) => {
    return `IPCMAIN: ${message}`
}

export const handleSendServerPort = (
    event: IpcMainInvokeEvent,
    message: string
) => {
    return { port: port }
}

export const exportDiaryHandler = async (
    mainWindow: BrowserWindow | null,
    format: Format
) => {
    const openDialogReturnValue = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    })
    mainWindow?.webContents.send('export-diary', [
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
    mainWindow?.webContents.send('export-all-diary', [
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
    mainWindow?.webContents.send('import-diary', [
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
    mainWindow?.webContents.send('import-all-diary', [
        format,
        openDialogReturnValue.filePaths,
    ])
}
