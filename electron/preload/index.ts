import { EChannel } from './shared/enums'
import {
    EventResult,
    ExportParam,
    ExportResult,
    ImportParam,
    ImportResult,
    SendMessagePortData,
    VerifyImportData,
} from './shared/params'

const { contextBridge, ipcRenderer } = require('electron')

declare global {
    interface Window {
        electronMessagePort: Electron.MessagePortMain
    }
}

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdatePort: (callback: (arg0: number) => void) =>
        ipcRenderer.on(EChannel.SEND_SERVER_PORT, (_event, value: number) =>
            callback(value)
        ),
    onClickMessage: (value: string) =>
        ipcRenderer.send(EChannel.CLICK_MESSAGE, value),
    onVerifyImport: (callback: (arg0: VerifyImportData) => boolean) => {
        ipcRenderer.on(
            EChannel.VERIFY_IMPORT,
            (_event, value: VerifyImportData) => {
                if (callback(value)) {
                    ipcRenderer.send(EChannel.VERIFY_IMPORT_RESULT, {
                        status: 200,
                        data: true,
                        message: 'OK',
                    })
                } else {
                    ipcRenderer.send(EChannel.VERIFY_IMPORT_RESULT, {
                        status: 500,
                        data: false,
                        message: 'ERROR',
                    })
                }
            }
        )
    },
    onExportDiary: (callback: (arg0: ExportParam) => void) =>
        ipcRenderer.on(EChannel.EXPORT_DIARY, (_event, value: ExportParam) =>
            callback(value)
        ),
    diaryExportValue: (value: EventResult<ExportResult>) =>
        ipcRenderer.send(EChannel.EXPORT_DIARY_VALUE, value),
    onExportAllDiaries: (callback: (arg0: ExportParam) => void) =>
        ipcRenderer.on(
            EChannel.EXPORT_ALL_DIARY,
            (_event, value: ExportParam) => callback(value)
        ),
    allDiaryExportsValue: (value: EventResult<ExportResult>) =>
        ipcRenderer.send(EChannel.EXPORT_ALL_DIARY_VALUE, value),

    onImportDiary: (callback: (arg0: ImportParam) => void) =>
        ipcRenderer.on(EChannel.IMPORT_DIARY, (_event, value: ImportParam) =>
            callback(value)
        ),
    diaryImportValue: (value: EventResult<ImportResult>) =>
        ipcRenderer.send(EChannel.IMPORT_DIARY_VALUE, value),
    onImportAllDiaries: (callback: (arg0: ImportParam) => void) =>
        ipcRenderer.on(
            EChannel.IMPORT_ALL_DIARY,
            (_event, value: ImportParam) => callback(value)
        ),
    allDiaryImportsValue: (value: EventResult<ImportResult>) =>
        ipcRenderer.send(EChannel.IMPORT_ALL_DIARY_VALUE, value),

    onNotifySuccess: (callback: (arg0: string) => void) =>
        ipcRenderer.on(EChannel.NOTIFY_SUCCESS, (_event, value: string) =>
            callback(value)
        ),
    onNotifyError: (callback: (arg0: string) => void) =>
        ipcRenderer.on(EChannel.NOTIFY_ERROR, (_event, value: string) =>
            callback(value)
        ),
})

// to register the onload listener before the load event is fired.
const windowLoaded = new Promise((resolve) => {
    window.onload = resolve
})

ipcRenderer.on(
    EChannel.SEND_MESSAGE_PORT,
    async (event, value: Omit<SendMessagePortData, 'channel'>) => {
        await windowLoaded
        // We use regular window.postMessage to transfer the port from the isolated
        // world to the main world.
        window.postMessage(
            { ...value, channel: EChannel.SEND_MESSAGE_PORT },
            '*',
            event.ports
        )
    }
)

// function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
//   return new Promise(resolve => {
//     if (condition.includes(document.readyState)) {
//       resolve(true)
//     } else {
//       document.addEventListener('readystatechange', () => {
//         if (condition.includes(document.readyState)) {
//           resolve(true)
//         }
//       })
//     }
//   })
// }

// const safeDOM = {
//   append(parent: HTMLElement, child: HTMLElement) {
//     if (!Array.from(parent.children).find(e => e === child)) {
//       return parent.appendChild(child)
//     }
//   },
//   remove(parent: HTMLElement, child: HTMLElement) {
//     if (Array.from(parent.children).find(e => e === child)) {
//       return parent.removeChild(child)
//     }
//   },
// }

// /**
//  * https://tobiasahlin.com/spinkit
//  * https://connoratherton.com/loaders
//  * https://projects.lukehaas.me/css-loaders
//  * https://matejkustec.github.io/SpinThatShit
//  */
// function useLoading() {
//   const className = `loaders-css__square-spin`
//   const styleContent = `
// @keyframes square-spin {
//   25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
//   50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
//   75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
//   100% { transform: perspective(100px) rotateX(0) rotateY(0); }
// }
// .${className} > div {
//   animation-fill-mode: both;
//   width: 50px;
//   height: 50px;
//   background: #fff;
//   animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
// }
// .app-loading-wrap {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: #282c34;
//   z-index: 9;
// }
//     `
//   const oStyle = document.createElement('style')
//   const oDiv = document.createElement('div')

//   oStyle.id = 'app-loading-style'
//   oStyle.innerHTML = styleContent
//   oDiv.className = 'app-loading-wrap'
//   oDiv.innerHTML = `<div class="${className}"><div></div></div>`

//   return {
//     appendLoading() {
//       safeDOM.append(document.head, oStyle)
//       safeDOM.append(document.body, oDiv)
//     },
//     removeLoading() {
//       safeDOM.remove(document.head, oStyle)
//       safeDOM.remove(document.body, oDiv)
//     },
//   }
// }

// // ----------------------------------------------------------------------

// const { appendLoading, removeLoading } = useLoading()
// domReady().then(appendLoading)

// window.onmessage = (ev) => {
//   ev.data.payload === 'removeLoading' && removeLoading()
// }

// setTimeout(removeLoading, 4999)
