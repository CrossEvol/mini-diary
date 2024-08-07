import IpcSafeButton from '@/components/ipc-safe-button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import parse, {
  DOMNode,
  domToReact,
  HTMLReactParserOptions
} from 'html-react-parser'
import React, { useState } from 'react'
import { Location, useLocation } from 'react-router-dom'
import { NavigateData } from './home-view'

const initialHtml = `
<p id="main">
  <span class="prettify">
    keep me and make me pretty!
  </span>
</p>
`

const options: HTMLReactParserOptions = {
  replace({ attribs, children }: DOMNode & any) {
    if (!attribs) {
      return
    }

    if (attribs.id === 'main') {
      return <h1 style={{ fontSize: 42 }}>{domToReact(children, options)}</h1>
    }

    if (attribs.class === 'prettify') {
      return (
        <span style={{ color: 'hotpink' }}>
          {domToReact(children, options)}
        </span>
      )
    }
  }
}

const HtmlTabsView = () => {
  const [html, setHtml] = useState(initialHtml)
  const location: Location<NavigateData> = useLocation()

  React.useEffect(() => {
    if (location.state) {
      setHtml(location.state.content)
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
          <div>{parse(html, options)}</div>
        </TabsContent>
        <TabsContent value="password">
          <div className="rounded-md bg-black">
            <pre style={{ whiteSpace: 'pre-wrap' }} className="p-2 text-white">
              {html}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HtmlTabsView
