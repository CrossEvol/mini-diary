import DiffBox from '@/components/diff-box'
import IpcSafeButton from '@/components/ipc-safe-button'
import PlainTextDiffBox from '@/components/plain-text-diff-box'
import PlainTextFrame from '@/components/plain-text-frame'
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
  const [primaryJson, setPrimaryJson] =
    useState<Record<string, any>>(initialJson)
  const [secondaryJson, setSecondaryJson] = useState<Record<string, any>>()
  const location: Location<NavigateData> = useLocation()
  const shouldDiff = !!secondaryJson && JSON.stringify(secondaryJson) !== '{}'

  React.useEffect(() => {
    console.log(location.state)
    if (location.state) {
      setPrimaryJson(JSON.parse(location.state.content))
      location.state.contentToBeImported &&
        setSecondaryJson(JSON.parse(location.state.contentToBeImported))
    }

    return () => {}
  }, [location.state])

  return (
    <div className="flex h-screen w-screen items-start justify-start">
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
          {shouldDiff ? (
            <DiffBox
              primary={<ReactJson src={primaryJson} />}
              secondary={<ReactJson src={secondaryJson} />}
            />
          ) : (
            <ReactJson src={primaryJson} />
          )}
        </TabsContent>
        <TabsContent value="password">
          {shouldDiff ? (
            <PlainTextDiffBox
              primary={JSON.stringify(primaryJson, null, 2)}
              secondary={JSON.stringify(secondaryJson, null, 2)}
            />
          ) : (
            <PlainTextFrame plainText={JSON.stringify(primaryJson, null, 2)} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default JsonTabsView
