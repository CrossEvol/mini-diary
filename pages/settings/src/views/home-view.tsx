import Settings from '@/components/settings/settings'
import { isDevelopment } from '@/constants'
import { Config, EChannel, GetConfig } from 'ce-shard'
import React from 'react'
import RingLoader from 'react-spinners/RingLoader'

export default function HomeView() {
  const [config, setConfig] = React.useState<Config>()

  const getConfigResultListener = (_event: any, value: Config) => {
    console.log(value)
    setConfig(value)
  }

  const useDynamicImportElectronInEjs = () => {
    if (!isDevelopment) {
      // Use electron APIs here
      const { ipcRenderer } = require('electron')

      ipcRenderer.on(EChannel.GET_CONFIG_RESULT, getConfigResultListener)

      ipcRenderer.send(EChannel.GET_CONFIG, {
        reset: false
      } satisfies GetConfig)
    }
  }

  React.useEffect(() => {
    useDynamicImportElectronInEjs()
    return () => {
      if (!isDevelopment) {
        // Use electron APIs here
        const { ipcRenderer } = require('electron')

        ipcRenderer.off(EChannel.GET_CONFIG_RESULT, getConfigResultListener)
      }
    }
  }, [])

  if (!config) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <RingLoader color="#95adb5" size={200} speedMultiplier={1} />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="h-96 w-[32rem]">
        <Settings config={config} />
      </div>
    </div>
  )
}
