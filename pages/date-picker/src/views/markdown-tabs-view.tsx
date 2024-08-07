import IpcSafeButton from '@/components/ipc-safe-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { useState } from 'react'
import Markdown from 'react-markdown'
import { Location, useLocation } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import { NavigateData } from './home-view'

const initialMarkdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`

const MarkdownTabsView = () => {
  const [markdown, setMarkdown] = useState(initialMarkdown)
  const location: Location<NavigateData> = useLocation()

  React.useEffect(() => {
    if (!!location.state) {
      setMarkdown(location.state.content)
    }

    return () => {}
  }, [location.state])

  return (
    <div className="flex h-screen w-screen items-start justify-center">
      <Tabs defaultValue="account" className="m-4 w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Prettier</TabsTrigger>
          <TabsTrigger value="password">PlainText</TabsTrigger>
          <IpcSafeButton data={location.state} className="sm:ml-20 md:ml-40" />
        </TabsList>
        <TabsContent value="account" className="min-w-96 p-2">
          <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </TabsContent>
        <TabsContent value="password">
          <div className="rounded-md bg-black">
            <pre style={{ whiteSpace: 'pre-wrap' }} className="p-2 text-white">
              {markdown}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MarkdownTabsView
