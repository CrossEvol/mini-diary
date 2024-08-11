import {
    BrowserWindow,
    BrowserWindowConstructorOptions,
    dialog,
    ipcMain,
    MessageChannelMain,
} from 'electron'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import mainLogger from './logging/main.logger'
import { EChannel, EFormat } from './shared/enums'
import {
    EditorContentData,
    EventResult,
    ExportParam,
    FileItem,
    ImportAllParam,
    ImportParam,
    newNotifyParam,
    SendMessagePortData,
} from './shared/params'
import { extraDateFromPath } from './util/file.util'

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
    const entryPath = 'pages/date-picker/dist/index.html'
    const subWindow = createSubWindowWithMessageChannel<
        Omit<SendMessagePortData, 'channel'>
    >(mainWindow!, entryPath, { format, toBeImported: false })

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
                            newNotifyParam({
                                message: 'SUCCESS',
                                hasSucceed: true,
                            })
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
                            newNotifyParam({
                                message: JSON.stringify(error),
                                hasSucceed: false,
                            })
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
        filters: [createFileFilters(format)],
        properties: ['openFile'],
    })
    if (openDialogReturnValue.canceled) {
        return
    }
    const fileItems = await Promise.all(
        openDialogReturnValue.filePaths.map(async (path) => {
            const content = await readFile(path, { encoding: 'utf-8' })
            return { path, content } as FileItem
        })
    )
    mainLogger.info(fileItems)
    ipcMain.once(
        EChannel.VERIFY_IMPORT_RESULT,
        async (_event, value: EventResult<boolean>) => {
            if (value.status === 200 && value.data) {
                // set up the channel.
                const entryPath = 'pages/date-picker/dist/index.html'
                const subWindow = createSubWindowWithMessageChannel<
                    Omit<SendMessagePortData, 'channel'>
                >(mainWindow!, entryPath, {
                    format,
                    toBeImported: true,
                })
                ipcMain.once(
                    EChannel.EDITOR_CONTENT,
                    async (_event, value: EditorContentData) => {
                        const { format, date } = value
                        mainWindow?.webContents.send(EChannel.IMPORT_DIARY, {
                            format,
                            date,
                            content: fileItems[0].content,
                        } as ImportParam)
                        mainLogger.info(value)
                        try {
                            subWindow.close()
                            setTimeout(
                                () =>
                                    mainWindow?.webContents.send(
                                        EChannel.NOTIFY_SUCCESS,
                                        newNotifyParam({
                                            message: 'SUCCESS',
                                            hasSucceed: true,
                                            redirectUrl: `/editor/${date}`,
                                        })
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
                                        newNotifyParam({
                                            message: JSON.stringify(error),
                                            hasSucceed: true,
                                        })
                                    ),
                                500
                            )
                        }
                    }
                )
            } else {
                await dialog.showMessageBox(mainWindow!, {
                    type: 'error',
                    message: `*.${format} FILE MIS_MATCHED.`,
                })
            }
        }
    )

    mainWindow?.webContents.send(EChannel.VERIFY_IMPORT, {
        format,
        content: fileItems[0].content,
    })
}
export const importAllDiariesHandler = async (
    mainWindow: BrowserWindow | null,
    format: EFormat
) => {
    const openDialogReturnValue = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [createFileFilters(format)],
    })

    if (openDialogReturnValue.canceled) {
        return
    }

    const fileItems: FileItem[] = (
        await Promise.all(
            openDialogReturnValue.filePaths.map(async (path) => {
                const content = await readFile(path, { encoding: 'utf-8' })
                return { path, content } as FileItem
            })
        )
    )
        .map((fileItem) => ({
            path: extraDateFromPath(fileItem.path),
            content: fileItem.content,
        }))
        .filter((fileItem) => fileItem.path.length !== 0)
    const set = new Set<FileItem>(fileItems)
    if (set.keys.length !== fileItems.length) {
        dialog.showMessageBoxSync({
            type: 'warning',
            message: 'Content in Duplicate date will be combined...',
        })
    }
    const combinedFileItems = fileItems.reduce((acc, cur, _idx) => {
        if (acc.map((fileItem) => fileItem.path).includes(cur.path)) {
            acc = acc.map((fileItem) =>
                fileItem.path === cur.path
                    ? {
                          ...fileItem,
                          content: combineContent(format, {
                              previous: fileItem.content,
                              current: cur.content,
                          }),
                      }
                    : fileItem
            )
        } else {
            acc.push(cur)
        }
        return acc
    }, [] as FileItem[])
    mainLogger.info(combinedFileItems)

    ipcMain.once(EChannel.PURE_REDIRECT, (_event, value) => {
        mainLogger.warn(value)

        // set up the channel.
        const entryPath = 'pages/imports-diff-box/dist/index.html'
        const subWindow = createSubWindow(entryPath)

        ipcMain.once(EChannel.PURE_REDIRECT, (_event, value) => {
            mainLogger.info(
                'After confirmation in sub window, redirect the data to the main window...'
            )
            if (subWindow.isClosable()) {
                subWindow.close()
            }
            mainWindow?.webContents.send(EChannel.PURE_REDIRECT, value)
        })

        subWindow.once('ready-to-show', () => {
            mainLogger.info('ready to send initial data to sub window...')
            subWindow.webContents.send(EChannel.PURE_REDIRECT, value)
        })
    })

    mainWindow?.webContents.send(EChannel.IMPORT_ALL_DIARY, {
        format,
        fileItems: combinedFileItems,
    } as ImportAllParam)
}
const createSubWindowWithMessageChannel = <T>(
    mainWindow: BrowserWindow,
    entryPath: string,
    data: T,
    options?: BrowserWindowConstructorOptions
) => {
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
        ...options,
    })

    const subEntryUrl =
        process.env.NODE_ENV === 'development'
            ? entryPath
            : join(process.env.DIST, entryPath)
    mainLogger.info(subEntryUrl)
    subWindow.loadFile(subEntryUrl)

    mainWindow?.webContents.postMessage(EChannel.SEND_MESSAGE_PORT, data, [
        port1,
    ])
    // The preload script will receive this IPC message and transfer the port
    // over to the main world.
    subWindow.once('ready-to-show', () => {
        subWindow.webContents.postMessage(EChannel.SEND_MESSAGE_PORT, data, [
            port2,
        ])
    })
    return subWindow
}

const createSubWindow = (
    entryPath: string,
    options?: BrowserWindowConstructorOptions
) => {
    const subWindow = new BrowserWindow({
        width: 800,
        height: 1080,
        parent: undefined,
        modal: true,
        title: 'Editor Content Preview',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: false,
        resizable: true,
        ...options,
    })

    const subEntryUrl =
        process.env.NODE_ENV === 'development'
            ? entryPath
            : join(process.env.DIST, entryPath)
    mainLogger.info(subEntryUrl)
    subWindow.loadFile(subEntryUrl)

    return subWindow
}

const createFileFilters = (format: EFormat): Electron.FileFilter => {
    switch (format) {
        case EFormat.JSON:
            return { name: 'json-filter', extensions: ['json'] }
        case EFormat.HTML:
            return { name: 'html-filter', extensions: ['html', 'htm'] }
        case EFormat.MARKDOWN:
            return {
                name: 'md-filter',
                extensions: ['md', 'mdown', 'markdown'],
            }
    }
}

const combineContent = (
    format: EFormat,
    { previous, current }: { previous: string; current: string }
) => {
    switch (format) {
        case EFormat.HTML:
            return previous + current
        case EFormat.JSON:
            return JSON.stringify([
                ...JSON.parse(previous),
                ...JSON.parse(current),
            ])
        case EFormat.MARKDOWN:
            return previous + current
    }
}
