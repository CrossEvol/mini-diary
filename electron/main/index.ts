import {
    BrowserWindow,
    Menu,
    MenuItem,
    MenuItemConstructorOptions,
    Notification,
    app,
    ipcMain,
    shell,
} from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { EChannel, Format } from './common/enums'
import { initPrisma } from './deprecated.prisma.util'
import {
    exportAllDiariesHandler,
    exportDiaryHandler,
    handlePortFromWorkerThread,
    importAllDiariesHandler,
    importDiaryHandler,
    port,
} from './eventHandler'
import { update } from './update'
import { startServerInWorker } from './util/worker.util'

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

startServerInWorker()

async function createWindow() {
    win = new BrowserWindow({
        title: 'Main window',
        icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
        webPreferences: {
            preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            nodeIntegration: false,
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
        if (!!port) {
            win?.webContents.send(EChannel.SEND_SERVER_PORT, { port })
        }
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
    ipcMain.on(EChannel.EXPORT_DIARY_VALUE, (_event, value) => {
        console.log(value) // will print value to Node console
        win?.webContents.send(EChannel.NOTIFY_SUCCESS, 'SUCCESS')
    })
    ipcMain.on(EChannel.EXPORT_ALL_DIARY_VALUE, (_event, value) => {
        console.log(value) // will print value to Node console
        win?.webContents.send(EChannel.NOTIFY_ERROR, 'ERROR')
    })
    ipcMain.on(EChannel.IMPORT_DIARY_VALUE, (_event, value) => {
        console.log(value) // will print value to Node console
        win?.webContents.send(EChannel.NOTIFY_SUCCESS, 'SUCCESS')
    })
    ipcMain.on(EChannel.IMPORT_ALL_DIARY_VALUE, (_event, value) => {
        console.log(value) // will print value to Node console
        win?.webContents.send(EChannel.NOTIFY_ERROR, 'ERROR')
    })
    ipcMain.on(EChannel.PORT_FROM_WORKER, handlePortFromWorkerThread)
    createWindow().then(() => {
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
                label: 'File',
                submenu: [
                    { role: 'quit' },
                    { label: 'a', click: showNotification },
                    {
                        label: 'import',
                        submenu: [
                            {
                                label: 'to JSON',
                                click: () =>
                                    importDiaryHandler(win, Format.JSON),
                            },
                            {
                                label: 'to Markdown',
                                click: () =>
                                    importDiaryHandler(win, Format.MARKDOWN),
                            },
                            {
                                label: 'to HTML',
                                click: () =>
                                    importDiaryHandler(win, Format.HTML),
                            },
                        ],
                    },
                    {
                        label: 'export',
                        submenu: [
                            {
                                label: 'to JSON',
                                click: () =>
                                    exportDiaryHandler(win, Format.JSON),
                            },
                            {
                                label: 'to Markdown',
                                click: () =>
                                    exportDiaryHandler(win, Format.MARKDOWN),
                            },
                            {
                                label: 'to HTML',
                                click: () =>
                                    exportDiaryHandler(win, Format.HTML),
                            },
                        ],
                    },
                    {
                        label: 'imports',
                        submenu: [
                            {
                                label: 'to JSON',
                                click: () =>
                                    importAllDiariesHandler(win, Format.JSON),
                            },
                            {
                                label: 'to Markdown',
                                click: () =>
                                    importAllDiariesHandler(
                                        win,
                                        Format.MARKDOWN
                                    ),
                            },
                            {
                                label: 'to HTML',
                                click: () =>
                                    importAllDiariesHandler(win, Format.HTML),
                            },
                        ],
                    },
                    {
                        label: 'exports',
                        submenu: [
                            {
                                label: 'to JSON',
                                click: () =>
                                    exportAllDiariesHandler(win, Format.JSON),
                            },
                            {
                                label: 'to Markdown',
                                click: () =>
                                    exportAllDiariesHandler(
                                        win,
                                        Format.MARKDOWN
                                    ),
                            },
                            {
                                label: 'to HTML',
                                click: () =>
                                    exportAllDiariesHandler(win, Format.HTML),
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
