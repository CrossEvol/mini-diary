import { Button } from '@/components/ui/button'
import React from 'react'
import { useState } from 'react'

const isDevelopment = process.env.NODE_ENV === 'development'

export default function HomeView() {
  const [date, setDate] = useState('')

  const useDynamicImportElectronInEjs = async () => {
    if (!isDevelopment) {
      // Use electron APIs here
      const { ipcRenderer } = require('electron')

      ipcRenderer.on('date-init', (_event: any, value: any) => {
        console.log(value)
        setDate(value)
      })
    }
  }

  React.useEffect(() => {
    useDynamicImportElectronInEjs()
    return () => {}
  }, [])

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Button onClick={() => {}}>Click me</Button>
      <p>date is {date}</p>
    </div>
  )
}
