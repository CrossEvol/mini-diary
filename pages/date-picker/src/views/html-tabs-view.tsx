import DiffBox from '@/components/diff-box'
import IpcSafeButton from '@/components/ipc-safe-button'
import PlainTextDiffBox from '@/components/plain-text-diff-box'
import PlainTextFrame from '@/components/plain-text-frame'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useImportTypeSelect from '@/hooks/use-import-type-select'
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
  //@ts-expect-error, definitions error not of mine, but of lib itself
  replace({ attribs, children }: DOMNode) {
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
  const [primaryHtml, setPrimaryHtml] = useState(initialHtml)
  const [secondaryHtml, setSecondaryHtml] = useState('')
  const { shouldBeOverridden, ImportTypeSelect } = useImportTypeSelect()
  const location: Location<NavigateData> = useLocation()
  const shouldDiff = !!secondaryHtml.length

  React.useEffect(() => {
    console.log(location.state)
    if (location.state) {
      setPrimaryHtml(location.state.content)
      location.state.contentToBeImported &&
        setSecondaryHtml(location.state.contentToBeImported)
    }

    return () => {}
  }, [location.state])

  return (
    <div className="flex h-screen w-screen items-start justify-start">
      <Tabs defaultValue="account" className="m-4 w-[400px]">
        <TabsList>
          <TabsTrigger value="account">Prettier</TabsTrigger>
          <TabsTrigger value="password">PlainText</TabsTrigger>
          <div className="flex flex-row sm:ml-20 md:ml-40">
            <div className="flex items-center space-x-2">
              {ImportTypeSelect}
            </div>
            <IpcSafeButton
              data={{ ...location.state, shouldBeOverridden }}
              className="uppercase"
            />
          </div>
        </TabsList>
        <TabsContent value="account" className="min-w-96 p-2">
          {shouldDiff ? (
            <DiffBox
              primary={parse(primaryHtml, options)}
              secondary={parse(secondaryHtml, options)}
            />
          ) : (
            <div>{parse(primaryHtml, options)}</div>
          )}
        </TabsContent>
        <TabsContent value="password">
          {shouldDiff ? (
            <PlainTextDiffBox primary={primaryHtml} secondary={secondaryHtml} />
          ) : (
            <PlainTextFrame plainText={primaryHtml} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HtmlTabsView
