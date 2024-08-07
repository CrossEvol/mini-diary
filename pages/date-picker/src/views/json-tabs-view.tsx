import IpcSafeButton from '@/components/ipc-safe-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { useState } from 'react'
import ReactJson from 'react-json-view'
import { Location, useLocation } from 'react-router-dom'
import { NavigateData } from './home-view'

const initialJson = {
  name: 'John Doe',
  age: 30,
  city: 'New York'
}

const JsonTabsView = () => {
  const [json, setJson] = useState<Record<string, any>>(initialJson)
  const location: Location<NavigateData> = useLocation()

  React.useEffect(() => {
    if (location.state) {
      setJson(JSON.parse(location.state.content))
    }

    return () => {}
  }, [location.state])

  return (
    <div className="flex h-screen w-screen items-start justify-center">
      <Tabs defaultValue="account" className="m-4 w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Prettier</TabsTrigger>
          <TabsTrigger value="password">PlainText</TabsTrigger>
          <IpcSafeButton
            data={location.state}
            className="uppercase sm:ml-20 md:ml-40"
          />
        </TabsList>
        <TabsContent value="account" className="min-w-96 p-2">
          <ReactJson src={json} />
        </TabsContent>
        <TabsContent value="password">
          <div className="rounded-md bg-black">
            <pre style={{ whiteSpace: 'pre-wrap' }} className="p-2 text-white">
              {JSON.stringify(json, null, 2)}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default JsonTabsView
