import { useEditorStorage } from '@/hooks/useEditorStorage'
import { uploadFile } from '@/utils/uploadFile'
import { BlockNoteEditor, PartialBlock } from '@blocknote/core'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { useEffect, useMemo, useState } from 'react'

export default function Editor() {
    const { loadContent, saveContent } = useEditorStorage()
    const [initialContent, setInitialContent] = useState<
        PartialBlock[] | undefined | 'loading'
    >('loading')

    useEffect(() => {
        loadContent().then((content) => {
            content;
            setInitialContent(content)
        })
    }, [])

    // Creates a new editor instance.
    // We use useMemo + createBlockNoteEditor instead of useCreateBlockNote so we
    // can delay the creation of the editor until the initial content is loaded.
    const editor = useMemo(() => {
        if (initialContent === 'loading') {
            return undefined
        }
        return BlockNoteEditor.create({ initialContent, uploadFile })
    }, [initialContent])

    if (editor === undefined) {
        return 'Loading content...'
    }

    return (
        <BlockNoteView
            editor={editor}
            emojiPicker={true}
            onChange={() => {
                saveContent(editor.document)
            }}
        />
    )
}
