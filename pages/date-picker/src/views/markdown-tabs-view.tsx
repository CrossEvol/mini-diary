import DiffBox from '@/components/diff-box'
import IpcSafeButton from '@/components/ipc-safe-button'
import PlainTextDiffBox from '@/components/plain-text-diff-box'
import PlainTextFrame from '@/components/plain-text-frame'
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
  const [primaryMarkdown, setPrimaryMarkdown] = useState(initialMarkdown)
  const [secondaryMarkdown, setSecondaryMarkdown] = useState('')
  const location: Location<NavigateData> = useLocation()
  const shouldDiff = !!secondaryMarkdown

  React.useEffect(() => {
    if (location.state) {
      setPrimaryMarkdown(location.state.content)
      setSecondaryMarkdown(location.state.contentToBeDiff)
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
              primary={
                <Markdown remarkPlugins={[remarkGfm]}>
                  {primaryMarkdown}
                </Markdown>
              }
              secondary={
                <Markdown remarkPlugins={[remarkGfm]}>
                  {secondaryMarkdown}
                </Markdown>
              }
            />
          ) : (
            <Markdown remarkPlugins={[remarkGfm]}>{primaryMarkdown}</Markdown>
          )}
        </TabsContent>
        <TabsContent value="password">
          {shouldDiff ? (
            <PlainTextDiffBox
              primary={primaryMarkdown}
              secondary={secondaryMarkdown}
            />
          ) : (
            <PlainTextFrame plainText={primaryMarkdown} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MarkdownTabsView
