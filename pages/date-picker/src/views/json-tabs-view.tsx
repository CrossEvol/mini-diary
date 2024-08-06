import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import ReactJson from 'react-json-view'

const JsonTabsView = () => {
  React.useEffect(() => {
    return () => {}
  }, [])

  return (
    <div className="flex h-screen w-screen items-start justify-center">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Show</TabsTrigger>
          <TabsTrigger value="password">Text</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <ReactJson src={{ a: 1, b: true }} />
        </TabsContent>
        <TabsContent value="password">
          <div className="bg-black">
            <pre style={{ whiteSpace: 'pre-wrap' }} className="text-white">
              {JSON.stringify(
                {
                  name: 'John Doe',
                  age: 30,
                  city: 'New York'
                },
                null,
                2
              )}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default JsonTabsView
