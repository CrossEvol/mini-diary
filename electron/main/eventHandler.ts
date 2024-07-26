import { IpcMainEvent, IpcMainInvokeEvent, dialog } from 'electron'

let port = 0

export async function handleFileOpen() {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    if (!canceled) {
        return filePaths[0]
    }
}

export const handleReceiveOneWayMsg = (
    event: IpcMainEvent,
    message: string
) => {
    console.log(message)
}

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
