import {
    EditorContentData,
    EventResult,
    ExportParam,
    ExportResult,
    ImportParam,
    ImportResult,
    NotifyParam,
} from 'ce-shard'

export interface IElectronAPI {
    toggle: () => void
    system: () => void
    onUpdatePort: (callback: (port: number) => void) => void
    onVerifyImport: (
        callback: (arg0: VerifyImportData) => Promise<boolean>
    ) => void

    onExportDiary: (callback: (arg0: ExportParam) => void) => void
    diaryExportValue: (value: EventResult<ExportResult>) => void
    onExportAllDiaries: (callback: (arg0: ExportParam) => void) => void
    allDiaryExportsValue: (value: EventResult<ExportResult>) => void

    onImportDiary: (callback: (arg0: ImportParam) => void) => void
    diaryImportValue: (value: EventResult<ImportResult>) => void
    onImportAllDiaries: (callback: (arg0: EditorContentData) => void) => void
    allDiaryImportsValue: (value: EventResult<ImportResult>) => void

    onNotifySuccess: (callback: (arg0: NotifyParam) => void) => void
    onNotifyError: (callback: (arg0: NotifyParam) => void) => void

    sendPureRedirect: <T>(value: T) => void
    onPureRedirect: <T>(callback: (arg0: T) => void) => void
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}
