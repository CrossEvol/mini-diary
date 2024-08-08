import { EmitterEvent, eventEmitterAtom } from '@/atoms/event.emitter.atom'
import { portAtom } from '@/atoms/message-port.atom'
import { profileAtom } from '@/atoms/profile.atom'
import { useEditorStorage } from '@/hooks/useEditorStorage'
import { useImportContentStorage } from '@/hooks/useImportContentStorage'
import { EFormat } from '@/shared/enums'
import { ExportParam, ImportParam, PickDateAndFormat } from '@/shared/params'
import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import fetchClient from '@/utils/fetch.client'
import { beautifyHtml } from '@/utils/html.util'
import { extractDataByDiaryKey } from '@/utils/regExp.utils'
import { createDiaryKey, createDiaryPath } from '@/utils/string.util'
import { Block, PartialBlock } from '@blocknote/core'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { useCreateBlockNote } from '@blocknote/react'
import { StatusCodes } from 'http-status-codes'
import { useAtom } from 'jotai'
import localforage from 'localforage'
import { join } from 'path-browserify'
import React from 'react'

const EditorLayout = () => {
    const [port] = useAtom(portAtom)
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
                console.log(
                    'from renderer main world:',
                    formatDateTime(date, DateTimeFormatEnum.DAY_FORMAT)
                )
                const content = await loadContent(
                    createDiaryKey(
                        profile?.id ?? 0,
                        formatDateTime(date, DateTimeFormatEnum.DATE_FORMAT)
                    )
                )
                port.postMessage({
                    format,
                    path: createDiaryPath(
                        profile?.nickname ?? 'unknown',
                        formatDateTime(date, DateTimeFormatEnum.DATE_FORMAT)
                    ),
                    content: await formatEditorContent(format, content),
                    contentToBeDiff: await loadImportContent(),
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
            const res = await fetchClient.put(
                `http://localhost:${localStorage.getItem('port')}/diaries`,
                {
                    body: JSON.stringify(diaries),
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            )
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
            async (value: ImportParam) => {
                console.log(value)
                await saveContent(
                    createDiaryKey(
                        profile?.id ?? 0,
                        formatDateTime(
                            value.date,
                            DateTimeFormatEnum.DATE_FORMAT
                        )
                    ),
                    await parseEditorContent(value.format, value.content)
                )
                await removeImportContent()
            }
        )
        eventEmitter.on(
            EmitterEvent.IMPORT_ALL_DIARY,
            async (value: ImportParam) => {
                console.log(value)
                window.electronAPI.allDiaryImportsValue({
                    data: null,
                    status: StatusCodes.OK,
                    message: '',
                })
            }
        )
        return () => {
            eventEmitter.removeListener('sync')
            eventEmitter.removeListener(EmitterEvent.EXPORT_DIARY)
            eventEmitter.removeListener(EmitterEvent.EXPORT_ALL_DIARY)
            eventEmitter.removeListener(EmitterEvent.IMPORT_DIARY)
            eventEmitter.removeListener(EmitterEvent.IMPORT_ALL_DIARY)
        }
    }, [eventEmitter, profile])
    return <div className='hidden'></div>
}

export default EditorLayout
