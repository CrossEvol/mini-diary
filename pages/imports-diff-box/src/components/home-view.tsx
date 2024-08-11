import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { isDevelopment } from '@/constants'
import React from 'react'
import { ConfirmDialog } from './confirm-dialog'
import PlainTextDiffBox from './plain-text-diff-box'
import PlainTextFrame from './plain-text-frame'
import { Button } from './ui/button'

const primaryMD = `
# fjdsalfdsjflasd

*   a
*   b
*   c

❤️\
🔤
`

const secondaryMD = `
# hello, world

*   a
*   b
*   c

❤️\
🔤

`

const diffDiaries = Array.from({ length: 10 })
  .map((_, i) => `2024-08-0${i}`)
  .map((date, i) => ({
    id: i + 1,
    date,
    contentToBeOverridden: `
    # hello , diary in ${date}
    ## this diary will be overridden
    *   a
    *   b
    *   c

    ❤️\
    🔤
    `,
    contentToBeImported: `
    # hello , diary in ${date}
    ## this diary will be imported!!
    *   a
    *   b
    *   c

    😀\
    (*^_^*)
    `
  }))

const importedDiaries = Array.from({ length: 10 })
  .map((_, i) => `2024-08-0${i}`)
  .map((date, i) => ({
    id: i + 1,
    date,
    contentToBeImported: `
    # hello , diary in ${date}
    ## this diary will be imported!!
    *   a
    *   b
    *   c

    😀\
    (*^_^*)
    `
  }))

export default function HomeView() {
  const useDynamicImportElectronInEjs = async () => {
    if (!isDevelopment) {
      // Use electron APIs here
      const { ipcRenderer } = require('electron')

      ipcRenderer.on('date-init', (_event: any, value: any) => {
        console.log(value)
      })
    }
  }

  React.useEffect(() => {
    useDynamicImportElectronInEjs()
    return () => {}
  }, [])

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Tabs defaultValue="account" className="w-[800px]">
        <TabsList>
          <TabsTrigger value="account">ToBeOverridden</TabsTrigger>
          <TabsTrigger value="password">ToBeCreated</TabsTrigger>
          <div className="inline-block uppercase sm:ml-20 md:ml-40">
            <ConfirmDialog
              triggerButton={<Button className="uppercase">Send</Button>}
              description={'Imports all diaries and overridden them.'}
              onClose={() => {}}
            />
          </div>
        </TabsList>
        <TabsContent value="account">
          <div>
            {diffDiaries.map((diary) => (
              <div key={diary.id}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={diary.id.toString()}>
                    <AccordionTrigger>{diary.date}</AccordionTrigger>
                    <AccordionContent>
                      <PlainTextDiffBox
                        primary={diary.contentToBeImported}
                        secondary={diary.contentToBeOverridden}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="password">
          <div>
            {importedDiaries.map((diary) => (
              <div key={diary.id}>
                <Accordion type="single" collapsible className="w-[36rem]">
                  <AccordionItem value={diary.id.toString()}>
                    <AccordionTrigger>{diary.date}</AccordionTrigger>
                    <AccordionContent>
                      <PlainTextFrame plainText={diary.contentToBeImported} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
