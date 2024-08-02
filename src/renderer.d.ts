export interface IElectronAPI {
    openFile: () => Promise<string>
    sendMessage: (message) => Promise<void>
    sendTwoWayMessage: (message) => Promise<string>
    updatePort: () => Promise<{ port: number }>
    onUpdateCounter: (callback: (arg0: any) => void) => void
    counterValue: (value: any) => void
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
