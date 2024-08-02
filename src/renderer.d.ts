export interface IElectronAPI {
    openFile: () => Promise<string>
    sendMessage: (message) => Promise<void>
    sendTwoWayMessage: (message) => Promise<string>
    updatePort: () => Promise<{ port: number }>

    onUpdateCounter: (callback: (arg0: any) => void) => void
    counterValue: (value: any) => void

    onExportDiary: (callback: (arg0: any) => void) => void
    diaryExportValue: (value: any) => void
    onExportAllDiaries: (callback: (arg0: any) => void) => void
    allDiaryExportsValue: (value: any) => void

    onImportDiary: (callback: (arg0: any) => void) => void
    diaryImportValue: (value: any) => void
    onImportAllDiaries: (callback: (arg0: any) => void) => void
    allDiaryImportsValue: (value: any) => void

    onNotifySuccess: (callback: (arg0: any) => void) => void
    onNotifyError: (callback: (arg0: any) => void) => void
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
