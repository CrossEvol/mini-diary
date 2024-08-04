import { EmitterEvent, eventEmitterAtom } from '@/atoms/event.emitter.atom'
import { profileAtom } from '@/atoms/profile.atom'
import { useEditorStorage } from '@/hooks/useEditorStorage'
import { EFormat } from '@/shared/enums'
import { ExportParam, ImportParam } from '@/shared/params'
import fetchClient from '@/utils/fetch.client'
import { extractDataByDiaryKey } from '@/utils/regExp.utils'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { useCreateBlockNote } from '@blocknote/react'
import { StatusCodes } from 'http-status-codes'
import { useAtom } from 'jotai'
import localforage from 'localforage'
import { join } from 'path-browserify'
import React from 'react'

const EditorLayout = () => {
    const editor = useCreateBlockNote()
    const [eventEmitter] = useAtom(eventEmitterAtom)
    const { loadContent } = useEditorStorage()
    const [profile] = useAtom(profileAtom)

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
                                switch (exportParam.format) {
                                    case EFormat.HTML:
                                        return await editor.blocksToHTMLLossy(
                                            await loadContent(key)
                                        )
                                    case EFormat.MARKDOWN:
                                        return await editor.blocksToMarkdownLossy(
                                            await loadContent(key)
                                        )
                                    case EFormat.JSON:
                                        return JSON.stringify(
                                            await loadContent(key)
                                        )
                                    default:
                                        return ''
                                }
                            })(),
                        }))
                )
                debugger
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
                window.electronAPI.diaryImportValue({
                    data: null,
                    status: StatusCodes.OK,
                    message: '',
                })
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
