import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { isDevelopment } from '@/constants'
import React, { useState } from 'react'
import PulseLoader from 'react-spinners/PulseLoader'
import { ConfirmDialog } from '../components/confirm-dialog'
import PlainTextDiffBox from '../components/plain-text-diff-box'
import PlainTextFrame from '../components/plain-text-frame'
import { Button } from '../components/ui/button'
import { FinalImportsData } from '@/shared/params'
import { EChannel } from '@/shared/enums'

const mockDiariesToBeOverridden = Array.from({ length: 10 })
  .map((_, i) => `2024-08-0${i}`)
  .map((date) => ({
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

const mockDiariesToBeCreated = Array.from({ length: 10 })
  .map((_, i) => `2024-08-0${i}`)
  .map((date) => ({
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

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex w-full justify-center">
        <PulseLoader />
      </div>
      <Skeleton className="h-[125px] w-96 rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-4 w-80" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-4 w-80" />
      </div>
    </div>
  )
}

export default function HomeView() {
  const [isLoading, setIsLoading] = useState(true)
  const [diffDiaries, setDiffDiaries] = useState(mockDiariesToBeOverridden)
  const [importedDiaries, setImportedDiaries] = useState(mockDiariesToBeCreated)

  React.useEffect(() => {
    if (isDevelopment) {
      setTimeout(() => setIsLoading(false), 2000)
    }

    return () => {}
  }, [])

  const useDynamicImportElectronInEjs = async () => {
    if (!isDevelopment) {
      // Use electron APIs here
      const { ipcRenderer } = require('electron')

      ipcRenderer.on(
        EChannel.PURE_REDIRECT,
        (_event: any, value: FinalImportsData) => {
          console.log(value)
          setIsLoading(false)
          setDiffDiaries(value.toBeOverridden)
          setImportedDiaries(value.toBeCreated)
        }
      )
    }
  }

  const handleSubmit = () => {
    if (!isDevelopment) {
      // Use electron APIs here
      const { ipcRenderer } = require('electron')

      ipcRenderer.send(EChannel.PURE_REDIRECT, {
        toBeOverridden: diffDiaries,
        toBeCreated: importedDiaries
      } as FinalImportsData)
    }
  }

  React.useEffect(() => {
    useDynamicImportElectronInEjs()
    return () => {}
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center">
        <SkeletonCard />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Tabs defaultValue="account" className="w-[800px]">
        <TabsList>
          <TabsTrigger value="account">
            ToBeOverridden{`(${diffDiaries.length})`}
          </TabsTrigger>
          <TabsTrigger value="password">
            ToBeCreated{`(${importedDiaries.length})`}
          </TabsTrigger>
          <div className="inline-block uppercase sm:ml-20 md:ml-40">
            <ConfirmDialog
              triggerButton={<Button className="uppercase">Send</Button>}
              description={'Imports all diaries and overridden them.'}
              onClose={handleSubmit}
            />
          </div>
        </TabsList>
        <TabsContent value="account">
          <div>
            {diffDiaries.map((diary) => (
              <div key={diary.date}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={diary.date.toString()}>
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
              <div key={diary.date}>
                <Accordion type="single" collapsible className="w-[36rem]">
                  <AccordionItem value={diary.date.toString()}>
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
