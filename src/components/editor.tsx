import { EmitterEvent, eventEmitterAtom } from '@/atoms/event.emitter.atom'
import { useEditorStorage } from '@/hooks/useEditorStorage'
import fetchClient from '@/utils/fetch.client'
import { uploadFile } from '@/utils/uploadFile'
import { BlockNoteEditor, PartialBlock } from '@blocknote/core'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { ExportParam, ImportParam } from 'electron/preload/common/params'
import { StatusCodes } from 'http-status-codes'
import { useAtom } from 'jotai'
import localforage from 'localforage'
import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

const createDiaryKey = (userID: number, date: string) =>
    `diary-${userID}-${date}`

const EditorAux = ({ editor }: { editor: BlockNoteEditor<any, any, any> }) => {
    const [eventEmitter] = useAtom(eventEmitterAtom)
    const { loadContent } = useEditorStorage()
    let flag = true

    React.useEffect(() => {
        if (flag) {
            eventEmitter.on('sync', async () => {
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
                async (value: ExportParam) => {
                    console.log(value)
                    window.electronAPI.allDiaryExportsValue({
                        data: { ...value, fileItems: [] },
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
        }

        return () => {
            flag = false
        }
    }, [eventEmitter])

    return <div className='hidden'></div>
}

export default function Editor() {
    const location = useLocation()
    const params = useParams<{ date: string }>()
    const { loadContent, saveContent } = useEditorStorage()
    const [initialContent, setInitialContent] = useState<
        PartialBlock[] | undefined | 'loading'
    >('loading')
    const diaryKey = createDiaryKey(1, params.date!)

    useEffect(() => {
        loadContent(diaryKey).then((content) => {
            content
            setInitialContent(content)
        })
    }, [location.pathname])

    // Creates a new editor instance.
    // We use useMemo + createBlockNoteEditor instead of useCreateBlockNote so we
    // can delay the creation of the editor until the initial content is loaded.
    const editor = useMemo(() => {
        if (initialContent === 'loading') {
            return undefined
        }
        return BlockNoteEditor.create({ initialContent, uploadFile })
    }, [initialContent, diaryKey])

    if (editor === undefined) {
        return 'Loading content...'
    }

    return (
        <>
            <BlockNoteView
                editor={editor}
                emojiPicker={true}
                onChange={async () => {
                    saveContent(diaryKey, editor.document)
                }}
            />
            <EditorAux editor={editor} />
        </>
    )
}
