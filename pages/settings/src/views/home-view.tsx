import Settings from '@/components/settings/settings'
import { isDevelopment } from '@/constants'
import React from 'react'

export default function HomeView() {
  const useDynamicImportElectronInEjs = async () => {
    if (!isDevelopment) {
      // Use electron APIs here
      const { ipcRenderer } = require('electron')

      ipcRenderer.on('', (_event: any, value: any) => {
        console.log(value)
      })

      ipcRenderer.send('', {})
    }
  }

  React.useEffect(() => {
    useDynamicImportElectronInEjs()
    return () => {}
  }, [])

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="h-96 w-[32rem]">
        <Settings />
      </div>
    </div>
  )
}
