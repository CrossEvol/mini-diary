import { EmitterEvent, eventEmitterAtom } from '@/atoms/event.emitter.atom'
import { portAtom } from '@/atoms/message-port.atom'
import { profileAtom } from '@/atoms/profile.atom'
import { toBeImportedAtom } from '@/atoms/to-be-imported.atom'
import { useEditorStorage } from '@/hooks/useEditorStorage'
import { useImportContentStorage } from '@/hooks/useImportContentStorage'
import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import fetchClient from '@/utils/fetch.client'
import { beautifyHtml } from '@/utils/html.util'
import { extractDataByDiaryKey } from '@/utils/regExp.utils'
import {
    ApiUrl,
    combineEditorContent,
    createDiaryKey,
    createDiaryPath,
    safeEditorContent,
} from '@/utils/string.util'
import { Block, PartialBlock } from '@blocknote/core'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { useCreateBlockNote } from '@blocknote/react'
import {
    EditorContentData, EFormat, ExportParam,
    FinalImportsData,
    ImportAllParam,
    PickDateAndFormat
} from 'ce-shard'
import { StatusCodes } from 'http-status-codes'
import { useAtom } from 'jotai'
import localforage from 'localforage'
import { join } from 'path-browserify'
import React from 'react'
import { MarkdownEntry } from '../editor-search-result/search-result'

export type SearchResultEntry = {
    diaryKey: string
    diaryValue: PartialBlock[] | undefined
}

const EditorLayout = () => {
    const [port] = useAtom(portAtom)
    const [toBeImported] = useAtom(toBeImportedAtom)
    const editor = useCreateBlockNote()
    const [eventEmitter] = useAtom(eventEmitterAtom)
    const { loadContent, saveContent } = useEditorStorage()
    const [profile] = useAtom(profileAtom)
    const { removeImportContent, loadImportContent } = useImportContentStorage()

    const parseEditorContent = async (format: EFormat, content: string) => {
        switch (format) {
            case EFormat.HTML:
                return await editor.tryParseHTMLToBlocks(content)
            case EFormat.MARKDOWN:
                return await editor.tryParseMarkdownToBlocks(content)
            case EFormat.JSON:
                return JSON.parse(content) as Block[]
        }
    }

    const parseEditorContent2JSON = async (
        format: EFormat,
        content: string
    ) => {
        switch (format) {
            case EFormat.HTML:
                return JSON.stringify(
                    await editor.tryParseHTMLToBlocks(content)
                )
            case EFormat.MARKDOWN:
                return JSON.stringify(
                    await editor.tryParseMarkdownToBlocks(content)
                )
            case EFormat.JSON:
                return content
        }
    }

    const formatEditorContent = async (
        format: EFormat,
        content?: PartialBlock[]
    ) => {
        if (!content) {
            return ''
        }

        switch (format) {
            case EFormat.HTML:
                return beautifyHtml(await editor.blocksToHTMLLossy(content))
            case EFormat.MARKDOWN:
                return await editor.blocksToMarkdownLossy(content)
            case EFormat.JSON:
                return JSON.stringify(content, null, 2)
            default:
                return ''
        }
    }

    React.useEffect(() => {
        if (!!port) {
            console.log('set listener on MessagePort...')
            // We can also receive messages from the main world of the renderer.
            port.onmessage = async (event: MessageEvent<PickDateAndFormat>) => {
                const { date, format } = event.data
                const formattedDate = formatDateTime(
                    date,
                    DateTimeFormatEnum.DATE_FORMAT
                )
                console.log('from renderer main world:', formattedDate)
                const content = await loadContent(
                    createDiaryKey(profile?.id ?? 0, formattedDate)
                )
                port.postMessage({
                    date: formattedDate,
                    format,
                    path: createDiaryPath(
                        profile?.nickname ?? 'unknown',
                        formattedDate
                    ),
                    content: toBeImported
                        ? content
                            ? await formatEditorContent(format, content)
                            : safeEditorContent(format)
                        : await formatEditorContent(format, content),
                    contentToBeImported: toBeImported
                        ? await loadImportContent()
                        : undefined,
                })
                port.start()
            }
        }
        return () => {}
    }, [port, profile])

    React.useEffect(() => {
        eventEmitter.on(EmitterEvent.SYNC, async () => {
            const diaries = await Promise.all(
                (await localforage.keys()).map(async (key) => ({
                    createdAt: new Date(key.substring(key.length - 10)),
                    content: await editor.blocksToHTMLLossy(
                        await loadContent(key)
                    ),
                }))
            )
            const res = await fetchClient.put(`${ApiUrl()}/diaries`, {
                body: JSON.stringify(diaries),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            console.log(res)
        })

        eventEmitter.on(
            EmitterEvent.EXPORT_DIARY,
            async (value: ExportParam) => {
                console.log(value)
                window.electronAPI.diaryExportValue({
                    data: { ...value, fileItems: [] },
                    status: StatusCodes.OK,
                    message: '',
                })
            }
        )
        eventEmitter.on(
            EmitterEvent.EXPORT_ALL_DIARY,
            async (exportParam: ExportParam) => {
                console.log(exportParam)
                const fileItems = await Promise.all(
                    (await localforage.keys())
                        .filter(
                            (key) =>
                                extractDataByDiaryKey(key)?.userId ===
                                profile?.id
                        )
                        .map(async (key) => ({
                            path: join(
                                exportParam.dir,
                                `diary-${profile?.nickname}-${extractDataByDiaryKey(key)?.date}.${exportParam.format}`
                            ),
                            content: await (async () => {
                                return formatEditorContent(
                                    exportParam.format,
                                    await loadContent(key)
                                )
                            })(),
                        }))
                )
                window.electronAPI.allDiaryExportsValue({
                    data: {
                        format: exportParam.format,
                        fileItems: fileItems,
                    },
                    status: StatusCodes.OK,
                    message: '',
                })
            }
        )

        eventEmitter.on(
            EmitterEvent.IMPORT_DIARY,
            async (value: EditorContentData) => {
                console.log(value)
                await saveContent(
                    createDiaryKey(
                        profile?.id ?? 0,
                        formatDateTime(
                            value.date,
                            DateTimeFormatEnum.DATE_FORMAT
                        )
                    ),
                    value.shouldBeOverridden
                        ? await parseEditorContent(
                              value.format,
                              value.contentToBeImported
                          )
                        : await parseEditorContent(
                              value.format,
                              combineEditorContent(value.format, {
                                  previous: value.content,
                                  current: value.contentToBeImported,
                              })
                          )
                )
                await removeImportContent()
            }
        )
        eventEmitter.on(
            EmitterEvent.IMPORT_ALL_DIARY,
            async (importAllParams: ImportAllParam) => {
                const keys = await localforage.keys()
                const fileItemEntries = await Promise.all(
                    importAllParams.fileItems.map(async (fileItem) => ({
                        key: createDiaryKey(profile?.id ?? 0, fileItem.path),
                        value: await parseEditorContent2JSON(
                            importAllParams.format,
                            fileItem.content
                        ),
                    }))
                )
                const toBeOverridden: FinalImportsData['toBeOverridden'] =
                    await Promise.all(
                        fileItemEntries
                            .filter((entry) => keys.includes(entry.key))
                            .map(async (entry) => ({
                                date: extractDataByDiaryKey(entry.key)?.date!,
                                type: 'OVER_RIDE',
                                contentToBeOverridden:
                                    await formatEditorContent(
                                        EFormat.MARKDOWN,
                                        (await loadContent(entry.key))!
                                    ),
                                contentToBeImported: await formatEditorContent(
                                    EFormat.MARKDOWN,
                                    JSON.parse(entry.value)
                                ),
                            }))
                    )
                const toBeCreated: FinalImportsData['toBeCreated'] =
                    await Promise.all(
                        fileItemEntries
                            .filter((entry) => !keys.includes(entry.key))
                            .map(async (entry) => ({
                                date: extractDataByDiaryKey(entry.key)?.date!,
                                type: 'CREATE',
                                contentToBeImported: await formatEditorContent(
                                    EFormat.MARKDOWN,
                                    JSON.parse(entry.value)
                                ),
                            }))
                    )

                window.electronAPI.onPureRedirect<FinalImportsData>(
                    async (value) => {
                        try {
                            for (const item of value.toBeCreated) {
                                await saveContent(
                                    createDiaryKey(profile?.id ?? 0, item.date),
                                    await editor.tryParseMarkdownToBlocks(
                                        item.contentToBeImported
                                    )
                                )
                            }

                            for (const item of value.toBeOverridden) {
                                await saveContent(
                                    createDiaryKey(profile?.id ?? 0, item.date),
                                    await editor.tryParseMarkdownToBlocks(
                                        item.type === 'OVER_RIDE'
                                            ? item.contentToBeImported
                                            : combineEditorContent(
                                                  importAllParams.format,
                                                  {
                                                      previous:
                                                          item.contentToBeOverridden,
                                                      current:
                                                          item.contentToBeImported,
                                                  }
                                              )
                                    )
                                )
                            }
                        } catch (error) {
                            console.log(value)
                            console.error(error)
                        }
                    }
                )

                window.electronAPI.sendPureRedirect<FinalImportsData>({
                    toBeOverridden,
                    toBeCreated,
                })
            }
        )
        eventEmitter.on(
            EmitterEvent.SEND_BLOCKS_TO_EDITOR,
            async (entries: SearchResultEntry[]) => {
                const markDownEntries = (await Promise.all(
                    entries.map(async (entry) => ({
                        date: extractDataByDiaryKey(entry.diaryKey)!.date,
                        mdText: await editor.blocksToMarkdownLossy(
                            entry.diaryValue
                        ),
                    }))
                )) satisfies MarkdownEntry[]
                eventEmitter.emit(EmitterEvent.RETURN_MARKDOWN_FROM_BLOCKS, markDownEntries)
            }
        )

        return () => {
            eventEmitter.removeListener(EmitterEvent.SYNC)
            eventEmitter.removeListener(EmitterEvent.EXPORT_DIARY)
            eventEmitter.removeListener(EmitterEvent.EXPORT_ALL_DIARY)
            eventEmitter.removeListener(EmitterEvent.IMPORT_DIARY)
            eventEmitter.removeListener(EmitterEvent.IMPORT_ALL_DIARY)
            eventEmitter.removeListener(EmitterEvent.SEND_BLOCKS_TO_EDITOR)
        }
    }, [eventEmitter, profile])
    return <div className='hidden'></div>
}

export default EditorLayout
