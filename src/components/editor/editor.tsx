import { profileAtom } from '@/atoms/profile.atom'
import { useEditorStorage } from '@/hooks/useEditorStorage'
import { createDiaryKey } from '@/utils/string.util'
import { resolveFileUrl, uploadFile } from '@/utils/uploadFile'
import { BlockNoteEditor, PartialBlock } from '@blocknote/core'
import '@blocknote/core/fonts/inter.css'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import {
  BlockColorsItem,
  DragHandleMenu,
  RemoveBlockItem,
  SideMenu,
  SideMenuController
} from '@blocknote/react'
import { useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { ResetBlockTypeItem } from './reset-block-item'

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
    return BlockNoteEditor.create({
      initialContent,
      uploadFile,
      resolveFileUrl
    })
  }, [initialContent, diaryKey])

  if (editor === undefined) {
    return 'Loading content...'
  }

  return (
    <>
      <BlockNoteView
        editor={editor}
        emojiPicker={true}
        sideMenu={false}
        onChange={async () => {
          saveContent(diaryKey, editor.document)
        }}
      >
        <SideMenuController
          sideMenu={(props) => (
            <SideMenu
              {...props}
              dragHandleMenu={(props) => (
                <DragHandleMenu {...props}>
                  <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
                  <BlockColorsItem {...props}>Colors</BlockColorsItem>
                  {/* Item which resets the hovered block's type. */}
                  <ResetBlockTypeItem {...props}>Reset Type</ResetBlockTypeItem>
                </DragHandleMenu>
              )}
            />
          )}
        />
      </BlockNoteView>
    </>
  )
}
