import {
    Config,
    EChannel,
    EFormat,
    FileType,
    GetConfig,
    UpdateConfigResult
} from 'ce-shard'
import {
    BrowserWindow,
    dialog,
    ipcMain,
    IpcMainEvent,
    Menu,
    MenuItem,
    MenuItemConstructorOptions
} from 'electron'
import { relative } from 'node:path'
import { writeConfigJson } from './config/boot-config'
import { CONFIG_PATH } from './config/config-path'
import { defaultConfig } from './config/default-config'
import {
    createSubWindow,
    exportAllDiariesHandler,
    exportDiaryHandler,
    importAllDiariesHandler,
    importDiaryHandler,
    IpcMainEventListener
} from './event-handler'
import { isDev } from './util/electron.util'

type SetMenusOptions = {
  config: Config
}

export const setMenus = (
  mainWindow: BrowserWindow,
  { config }: SetMenusOptions
) => {
  const template: (MenuItemConstructorOptions | MenuItem)[] = [
    // { role: 'appMenu' },
    // { role: 'fileMenu' }
    {
      label: 'system',
      submenu: [
        {
          label: 'home',
          click: () => {
            mainWindow.webContents.send(EChannel.NAVIGATE_TO_HOME)
          }
        },
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
                contextIsolation: false
              },
              closable: false
            })

            const handleGetConfigEvent: IpcMainEventListener = (
              _event,
              value: GetConfig
            ) => {
              if (value.reset) {
                writeConfigJson(CONFIG_PATH, defaultConfig)
                settingsWindow.webContents.send(
                  EChannel.GET_CONFIG_RESULT,
                  defaultConfig
                )
              } else {
                settingsWindow.webContents.send(
                  EChannel.GET_CONFIG_RESULT,
                  config
                )
              }
            }
            ipcMain.on(EChannel.GET_CONFIG, handleGetConfigEvent)

            const handleGetFilePathEvent = async (
              _event: IpcMainEvent,
              filetype: FileType
            ) => {
              const { canceled, filePaths } = await dialog.showOpenDialog({
                properties: [filetype === 'file' ? 'openFile' : 'openDirectory']
              })
              if (canceled) {
                return
              }
              settingsWindow.webContents.send(
                EChannel.GET_FILE_PATH_RESULT,
                relative(
                  isDev() ? process.cwd() : process.resourcesPath,
                  filePaths[0]
                )
              )
            }
            ipcMain.on(EChannel.GET_FILE_PATH, handleGetFilePathEvent)

            const handleUpdateConfigEvent = (
              _event: IpcMainEvent,
              value: Config
            ) => {
              const hasSucceed = writeConfigJson(CONFIG_PATH, value)
              settingsWindow.webContents.send(EChannel.UPDATE_CONFIG_RESULT, {
                status: hasSucceed
              } satisfies UpdateConfigResult)
            }
            ipcMain.on(EChannel.UPDATE_CONFIG, handleUpdateConfigEvent)

            const handleCloseWindow = (_event: IpcMainEvent) => {
              if (!settingsWindow.isClosable()) {
                settingsWindow.setClosable(true)
              }
              settingsWindow.close()
              ipcMain.off(EChannel.GET_CONFIG, handleGetConfigEvent)
              ipcMain.off(EChannel.GET_FILE_PATH, handleGetFilePathEvent)
              ipcMain.off(EChannel.UPDATE_CONFIG, handleUpdateConfigEvent)
            }
            ipcMain.once(EChannel.CLOSE_SETTINGS_WINDOW, handleCloseWindow)

            ipcMain.once('date-selected', (event, date) => {
              dialog.showMessageBox(mainWindow!, {
                type: 'info',
                message: `You selected: ${date}`
              })
              settingsWindow.close()
            })
          }
        },
        { role: 'quit' }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'import',
          submenu: [
            {
              label: 'from JSON',
              click: () => importDiaryHandler(mainWindow, EFormat.JSON)
            },
            {
              label: 'from Markdown',
              click: () => importDiaryHandler(mainWindow, EFormat.MARKDOWN)
            },
            {
              label: 'from HTML',
              click: () => importDiaryHandler(mainWindow, EFormat.HTML)
            }
          ]
        },
        {
          label: 'export',
          submenu: [
            {
              label: 'to JSON',
              click: () => exportDiaryHandler(mainWindow, EFormat.JSON)
            },
            {
              label: 'to Markdown',
              click: () => exportDiaryHandler(mainWindow, EFormat.MARKDOWN)
            },
            {
              label: 'to HTML',
              click: () => exportDiaryHandler(mainWindow, EFormat.HTML)
            }
          ]
        },
        {
          label: 'imports',
          submenu: [
            {
              label: 'from JSON',
              click: () => importAllDiariesHandler(mainWindow, EFormat.JSON)
            },
            {
              label: 'from Markdown',
              click: () => importAllDiariesHandler(mainWindow, EFormat.MARKDOWN)
            },
            {
              label: 'from HTML',
              click: () => importAllDiariesHandler(mainWindow, EFormat.HTML)
            }
          ]
        },
        {
          label: 'exports',
          submenu: [
            {
              label: 'to JSON',
              click: () => exportAllDiariesHandler(mainWindow, EFormat.JSON)
            },
            {
              label: 'to Markdown',
              click: () => exportAllDiariesHandler(mainWindow, EFormat.MARKDOWN)
            },
            {
              label: 'to HTML',
              click: () => exportAllDiariesHandler(mainWindow, EFormat.HTML)
            }
          ]
        }
      ]
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
          { role: 'selectAll' }
        ] satisfies MenuItemConstructorOptions[])
      ]
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
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...[{ role: 'close' } as MenuItemConstructorOptions]
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
