import {
    Config,
    EChannel,
    EFormat,
    EventResult,
    ExportResult,
    FileType,
    ImportResult,
    newNotifyParam,
    UpdateConfigResult,
} from 'ce-shard'
import {
    app,
    BrowserWindow,
    dialog,
    ipcMain,
    IpcMainEvent,
    Menu,
    MenuItem,
    MenuItemConstructorOptions,
    MessageChannelMain,
    Notification,
    shell
} from 'electron'
import { writeFile } from 'node:fs/promises'
import { release } from 'node:os'
import { join, relative } from 'node:path'
import { initializeConfig, writeConfigJson } from './config/boot-config'
import { CONFIG_PATH } from './config/config-path'
import { initPrisma } from './deprecated.prisma.util'
import {
    createSubWindow,
    exportAllDiariesHandler,
    exportDiaryHandler,
    importAllDiariesHandler,
    importDiaryHandler,
} from './eventHandler'
import mainLogger from './logging/main.logger'
import { showMessageBox } from './message-box'
import { startHonoServer } from './server/hono.app'
import { update } from './update'
import { isDev } from './util/electron.util'
import { killPort } from './util/net.util'

const config = initializeConfig()
mainLogger.info('Configuration loaded:', config)
;(async () => {
    if (await killPort(4444)) {
        mainLogger.info('kill the 4444 port successfully.')
    } else {
        mainLogger.error('kill the 4444 port Failed.')
    }
})()

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

initPrisma()

const buildMenus = (mainWindow: BrowserWindow) => {
    const NOTIFICATION_TITLE = 'Basic Notification'
    const NOTIFICATION_BODY = 'Notification from the Main process'

    function showNotification() {
        new Notification({
            title: NOTIFICATION_TITLE,
            body: NOTIFICATION_BODY,
        }).show()
    }

    const template: (MenuItemConstructorOptions | MenuItem)[] = [
        // { role: 'appMenu' },
        // { role: 'fileMenu' }
        {
            label: app.name,
            submenu: [
                {
                    label: 'settings',
                    click: () => {
                        const entryPath = 'pages/settings/dist/index.html'
                        const settingsWindow = createSubWindow(entryPath, {
                            width: 600,
                            height: 800,
                            parent: undefined,
                            modal: true,
                            webPreferences: {
                                nodeIntegration: true,
                                contextIsolation: false,
                            },
                            autoHideMenuBar: false,
                            resizable: false,
                        })

                        const handleGetConfigEvent = () => {
                            settingsWindow.webContents.send(
                                EChannel.GET_CONFIG_RESULT,
                                config
                            )
                        }
                        ipcMain.on(EChannel.GET_CONFIG, handleGetConfigEvent)

                        const handleGetFilePathEvent = async (
                            _event: IpcMainEvent,
                            filetype: FileType
                        ) => {
                            const { canceled, filePaths } =
                                await dialog.showOpenDialog({
                                    properties: [
                                        filetype === 'file'
                                            ? 'openFile'
                                            : 'openDirectory',
                                    ],
                                })
                            if (canceled) {
                                return
                            }
                            settingsWindow.webContents.send(
                                EChannel.GET_FILE_PATH_RESULT,
                                relative(
                                    isDev()
                                        ? process.cwd()
                                        : process.resourcesPath,
                                    filePaths[0]
                                )
                            )
                        }
                        ipcMain.on(
                            EChannel.GET_FILE_PATH,
                            handleGetFilePathEvent
                        )

                        const handleUpdateConfigEvent = (
                            _event: IpcMainEvent,
                            value: Config
                        ) => {
                            const hasSucceed = writeConfigJson(
                                CONFIG_PATH,
                                value
                            )
                            settingsWindow.webContents.send(
                                EChannel.UPDATE_CONFIG_RESULT,
                                {
                                    status: hasSucceed,
                                } satisfies UpdateConfigResult
                            )
                        }
                        ipcMain.on(
                            EChannel.UPDATE_CONFIG,
                            handleUpdateConfigEvent
                        )
                        // settingsWindow.once('ready-to-show', () => {
                        //     settingsWindow.webContents.send(
                        //         EChannel.GET_CONFIG_RESULT,
                        //         '2011-01-01'
                        //     )
                        // })

                        const handleCloseWindow = (_event: IpcMainEvent) => {
                            ipcMain.off(
                                EChannel.GET_CONFIG,
                                handleGetConfigEvent
                            )
                            ipcMain.off(
                                EChannel.GET_FILE_PATH,
                                handleGetFilePathEvent
                            )
                            ipcMain.off(
                                EChannel.UPDATE_CONFIG,
                                handleUpdateConfigEvent
                            )
                            if (!settingsWindow.isClosable()) {
                                settingsWindow.setClosable(true)
                            }
                            settingsWindow.close()
                        }
                        ipcMain.on(
                            EChannel.CLOSE_SETTINGS_WINDOW,
                            handleCloseWindow
                        )

                        ipcMain.once('date-selected', (event, date) => {
                            dialog.showMessageBox(mainWindow!, {
                                type: 'info',
                                message: `You selected: ${date}`,
                            })
                            settingsWindow.close()
                        })
                    },
                },
                { label: 'b', click: () => showMessageBox(win!) },
                {
                    click: () => {
                        const datePickerWindow = new BrowserWindow({
                            width: 1000,
                            height: 800,
                            parent: win!,
                            modal: true,
                            webPreferences: {
                                nodeIntegration: true,
                                contextIsolation: false,
                            },
                            autoHideMenuBar: false,
                            resizable: false,
                        })

                        const datePickerUrl =
                            process.env.NODE_ENV === 'development'
                                ? 'date-picker.html'
                                : join(process.env.DIST, 'date-picker.html')
                        console.log(datePickerUrl)
                        datePickerWindow.loadFile(datePickerUrl)
                        datePickerWindow.once('ready-to-show', () => {
                            datePickerWindow.webContents.send(
                                'date-init',
                                '2011-01-01'
                            )
                        })

                        ipcMain.once('date-selected', (event, date) => {
                            dialog.showMessageBox(mainWindow!, {
                                type: 'info',
                                message: `You selected: ${date}`,
                            })
                            datePickerWindow.close()
                        })
                    },
                    label: 'Message',
                },
                {
                    click: () => {
                        const messageBoxWindow = new BrowserWindow({
                            width: 1000,
                            height: 800,
                            parent: win!,
                            modal: true,
                            webPreferences: {
                                nodeIntegration: true,
                                contextIsolation: false,
                            },
                            autoHideMenuBar: false,
                            resizable: false,
                        })

                        const messageBoxUrl =
                            process.env.NODE_ENV === 'development'
                                ? 'pages/imports-diff-box/dist/index.html'
                                : join(
                                      process.env.DIST,
                                      'pages/imports-diff-box/dist/index.html'
                                  )
                        messageBoxWindow.loadFile(messageBoxUrl)
                        messageBoxWindow.once('ready-to-show', () => {
                            messageBoxWindow.webContents.send(
                                'date-init',
                                '2011-01-01'
                            )
                        })

                        ipcMain.once('date-selected', (event, date) => {
                            dialog.showMessageBox(mainWindow!, {
                                type: 'info',
                                message: `You selected: ${date}`,
                            })
                            messageBoxWindow.close()
                        })
                    },
                    label: 'ImportsBox',
                },
                {
                    click: () => {
                        // set up the channel.
                        const { port1, port2 } = new MessageChannelMain()

                        const datePickerWindow = new BrowserWindow({
                            width: 1440,
                            height: 1080,
                            parent: undefined,
                            modal: true,
                            webPreferences: {
                                nodeIntegration: true,
                                contextIsolation: true,
                                preload: join(
                                    __dirname,
                                    '../preload-date-picker/index.js'
                                ),
                            },
                            autoHideMenuBar: false,
                            resizable: false,
                        })

                        const datePickerUrl =
                            process.env.NODE_ENV === 'development'
                                ? 'pages/date-picker/dist/index.html'
                                : join(
                                      process.env.DIST,
                                      'pages/date-picker/dist/index.html'
                                  )
                        console.log(datePickerUrl)
                        datePickerWindow.loadFile(datePickerUrl)

                        mainWindow.webContents.postMessage(
                            EChannel.SEND_MESSAGE_PORT,
                            null,
                            [port1]
                        )

                        // The preload script will receive this IPC message and transfer the port
                        // over to the main world.
                        datePickerWindow.once('ready-to-show', () => {
                            datePickerWindow.webContents.postMessage(
                                EChannel.SEND_MESSAGE_PORT,
                                null,
                                [port2]
                            )
                        })

                        ipcMain.once(
                            EChannel.CLICK_MESSAGE,
                            (event, message) => {
                                dialog.showMessageBox(win!, {
                                    type: 'info',
                                    message: `You selected: ${message}`,
                                })
                                datePickerWindow.close()
                            }
                        )
                    },
                    label: 'SubWindow',
                },
            ],
        },
        {
            label: 'File',
            submenu: [
                { role: 'quit' },
                { label: 'a', click: showNotification },
                {
                    label: 'import',
                    submenu: [
                        {
                            label: 'from JSON',
                            click: () =>
                                importDiaryHandler(mainWindow, EFormat.JSON),
                        },
                        {
                            label: 'from Markdown',
                            click: () =>
                                importDiaryHandler(
                                    mainWindow,
                                    EFormat.MARKDOWN
                                ),
                        },
                        {
                            label: 'from HTML',
                            click: () =>
                                importDiaryHandler(mainWindow, EFormat.HTML),
                        },
                    ],
                },
                {
                    label: 'export',
                    submenu: [
                        {
                            label: 'to JSON',
                            click: () =>
                                exportDiaryHandler(mainWindow, EFormat.JSON),
                        },
                        {
                            label: 'to Markdown',
                            click: () =>
                                exportDiaryHandler(
                                    mainWindow,
                                    EFormat.MARKDOWN
                                ),
                        },
                        {
                            label: 'to HTML',
                            click: () =>
                                exportDiaryHandler(mainWindow, EFormat.HTML),
                        },
                    ],
                },
                {
                    label: 'imports',
                    submenu: [
                        {
                            label: 'from JSON',
                            click: () =>
                                importAllDiariesHandler(
                                    mainWindow,
                                    EFormat.JSON
                                ),
                        },
                        {
                            label: 'from Markdown',
                            click: () =>
                                importAllDiariesHandler(
                                    mainWindow,
                                    EFormat.MARKDOWN
                                ),
                        },
                        {
                            label: 'from HTML',
                            click: () =>
                                importAllDiariesHandler(
                                    mainWindow,
                                    EFormat.HTML
                                ),
                        },
                    ],
                },
                {
                    label: 'exports',
                    submenu: [
                        {
                            label: 'to JSON',
                            click: () =>
                                exportAllDiariesHandler(
                                    mainWindow,
                                    EFormat.JSON
                                ),
                        },
                        {
                            label: 'to Markdown',
                            click: () =>
                                exportAllDiariesHandler(
                                    mainWindow,
                                    EFormat.MARKDOWN
                                ),
                        },
                        {
                            label: 'to HTML',
                            click: () =>
                                exportAllDiariesHandler(
                                    mainWindow,
                                    EFormat.HTML
                                ),
                        },
                    ],
                },
            ],
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...([
                    { role: 'delete' },
                    { type: 'separator' },
                    { role: 'selectAll' },
                ] as MenuItemConstructorOptions[]),
            ],
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...[{ role: 'close' } as MenuItemConstructorOptions],
            ],
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://electronjs.org')
                    },
                },
            ],
        },
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}

async function createWindow() {
    const port = await startHonoServer()

    win = new BrowserWindow({
        width: 1000,
        height: 800,
        title: 'Main window',
        icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
        webPreferences: {
            preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            nodeIntegration: true,
            contextIsolation: true,
        },
    })

    if (url) {
        // electron-vite-vue#298
        win.loadURL(url)
        // Open devTool if the app is not packaged
        win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send(
            'main-process-message',
            new Date().toLocaleString()
        )
    })

    win.once('ready-to-show', () => {
        win?.webContents.send(EChannel.SEND_SERVER_PORT, port)
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })

    // Apply electron-updater
    update(win)
}

app.whenReady().then(() => {
    ipcMain.on(
        EChannel.EXPORT_ALL_DIARY_VALUE,
        (_event, value: EventResult<ExportResult>) => {
            mainLogger.info(value)
            Promise.all(
                value.data.fileItems.map(
                    async (fileItem) =>
                        await writeFile(fileItem.path, fileItem.content, {
                            encoding: 'utf-8',
                        })
                )
            )
                .then((res) =>
                    win?.webContents.send(
                        EChannel.NOTIFY_SUCCESS,
                        newNotifyParam({ message: 'SUCCESS', hasSucceed: true })
                    )
                )
                .catch((err) =>
                    win?.webContents.send(
                        EChannel.NOTIFY_ERROR,
                        newNotifyParam({ message: err, hasSucceed: false })
                    )
                )
        }
    )

    ipcMain.on(
        EChannel.IMPORT_ALL_DIARY_VALUE,
        (_event, value: EventResult<ImportResult>) => {
            mainLogger.info(value)
            win?.webContents.send(
                EChannel.NOTIFY_ERROR,
                newNotifyParam({ message: 'ERROR', hasSucceed: false })
            )
        }
    )
    // ipcMain.on(EChannel.PORT_FROM_WORKER, handlePortFromWorkerThread) // maybe be useful once I solve how to  bundle the worker
    createWindow().then(() => {
        buildMenus(win!)
    })
})

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`)
    } else {
        childWindow.loadFile(indexHtml, { hash: arg })
    }
})
