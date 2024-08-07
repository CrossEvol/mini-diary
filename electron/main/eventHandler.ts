import { BrowserWindow, dialog, ipcMain, MessageChannelMain } from 'electron'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import mainLogger from './logging/main.logger'
import { EChannel, EFormat } from './shared/enums'
import {
    EditorContentData,
    ExportParam,
    FileItem,
    ImportParam,
} from './shared/params'

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
    if (openDialogReturnValue.canceled) {
        return
    }
    const dir = openDialogReturnValue.filePaths[0]

    // deprecated
    /*  mainWindow?.webContents.send(EChannel.EXPORT_DIARY, {
        format,
        dir,
    } as ExportParam) */

    // set up the channel.
    const { port1, port2 } = new MessageChannelMain()

    const subWindow = new BrowserWindow({
        width: 800,
        height: 1080,
        parent: undefined,
        modal: true,
        title: 'Editor Content Preview',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: join(__dirname, '../preload-date-picker/index.js'),
        },
        autoHideMenuBar: false,
        resizable: false,
    })

    const datePickerUrl =
        process.env.NODE_ENV === 'development'
            ? 'pages/date-picker/dist/index.html'
            : join(process.env.DIST, 'pages/date-picker/dist/index.html')
    console.log(datePickerUrl)
    subWindow.loadFile(datePickerUrl)

    mainWindow?.webContents.postMessage(EChannel.SEND_MESSAGE_PORT, format, [
        port1,
    ])
    // The preload script will receive this IPC message and transfer the port
    // over to the main world.
    subWindow.once('ready-to-show', () => {
        subWindow.webContents.postMessage(EChannel.SEND_MESSAGE_PORT, format, [
            port2,
        ])
    })

    ipcMain.once(
        EChannel.EDITOR_CONTENT,
        async (_event, value: EditorContentData) => {
            const { path, format, content } = value
            mainLogger.info(value)
            try {
                await writeFile(join(dir, `${path}.${format}`), content, {
                    encoding: 'utf-8',
                })
                subWindow.close()
                setTimeout(
                    () =>
                        mainWindow?.webContents.send(
                            EChannel.NOTIFY_SUCCESS,
                            'SUCCESS'
                        ),
                    500
                )
            } catch (error) {
                mainLogger.error(error)
                subWindow.close()
                setTimeout(
                    () =>
                        mainWindow?.webContents.send(
                            EChannel.NOTIFY_ERROR,
                            error
                        ),
                    500
                )
            }
        }
    )
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
