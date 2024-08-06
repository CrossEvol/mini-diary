import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`

const MarkdownTabsView = () => {
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
          <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
        </TabsContent>
        <TabsContent value="password">
          <div className="bg-black">
            <pre style={{ whiteSpace: 'pre-wrap' }} className="text-white">
              {markdown}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MarkdownTabsView
