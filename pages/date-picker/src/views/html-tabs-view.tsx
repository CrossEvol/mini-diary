import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import parse, {
  DOMNode,
  domToReact,
  HTMLReactParserOptions
} from 'html-react-parser'
import React from 'react'

const html = `
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
          <div>{parse(html, options)}</div>
        </TabsContent>
        <TabsContent value="password">
          <div className="bg-black">
            <pre style={{ whiteSpace: 'pre-wrap' }} className="text-white">
              {html}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HtmlTabsView
