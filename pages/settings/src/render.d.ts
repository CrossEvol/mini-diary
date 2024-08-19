
export interface IElectronAPI {
  onClickMessage: (value: string) => void
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
