import {
    EChannel,
    EventResult,
    ExportResult,
    ImportResult,
    newNotifyParam
} from 'ce-shard'
import { app, BrowserWindow, ipcMain, nativeTheme, shell } from 'electron'
import { writeFile } from 'node:fs/promises'
import { release } from 'node:os'
import { join } from 'node:path'
import { initializeConfig } from './config/boot-config'
import { initPrisma } from './deprecated.prisma.util'
import mainLogger from './logging/main.logger'
import { startHonoServer } from './server/hono.app'
import { setMenus } from './set-menus'
import { update } from './update'
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
      contextIsolation: true
    }
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
    win?.webContents.send('main-process-message', new Date().toLocaleString())
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
              encoding: 'utf-8'
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
    setMenus(win!, { config })
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

ipcMain.on(EChannel.OPEN_EXTERNAL_URL, (_, url) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true
  })
  childWindow.loadURL(url)
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})
