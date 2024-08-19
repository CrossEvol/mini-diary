import Settings from '@/components/settings/settings'
import { isDevelopment } from '@/constants'
import { Config, EChannel, GetConfig } from 'ce-shard'
import React from 'react'

export default function HomeView() {
  const [config, setConfig] = React.useState<Config>()

  const useDynamicImportElectronInEjs = async () => {
    if (!isDevelopment) {
      // Use electron APIs here
      const { ipcRenderer } = require('electron')

      ipcRenderer.on(
        EChannel.GET_CONFIG_RESULT,
        (_event: any, value: Config) => {
          console.log(value)
          setConfig(value)
        }
      )

      ipcRenderer.send(EChannel.GET_CONFIG, {
        reset: false
      } satisfies GetConfig)
    }
  }

  React.useEffect(() => {
    useDynamicImportElectronInEjs()
    return () => {}
  }, [])

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="h-96 w-[32rem]">
        <Settings config={config} />
      </div>
    </div>
  )
}
