
export interface IElectronAPI {
    openFile: () => Promise<string>
    sendMessage: (message) => Promise<void>
    sendTwoWayMessage: (message) => Promise<string>
    updatePort: () => Promise<{ port: number }>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
