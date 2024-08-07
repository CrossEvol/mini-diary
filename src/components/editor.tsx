import { profileAtom } from '@/atoms/profile.atom'
import { useEditorStorage } from '@/hooks/useEditorStorage'
import { uploadFile } from '@/utils/uploadFile'
import { BlockNoteEditor, PartialBlock } from '@blocknote/core'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

export const createDiaryKey = (userID: number, date: string) =>
    `diary-${userID}-${date}`

export const createDiaryPath = (username: string, date: string) =>
    `diary-${username}-${date}`

export default function Editor() {
    const location = useLocation()
    const params = useParams<{ date: string }>()
    const { loadContent, saveContent } = useEditorStorage()
    const [initialContent, setInitialContent] = useState<
        PartialBlock[] | undefined | 'loading'
    >('loading')
    const [profile] = useAtom(profileAtom)
    const diaryKey = useMemo(
        () => createDiaryKey(profile?.id ?? 0, params.date!),
        [profile?.id, params.date]
    )

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
        </>
    )
}
