import { Block, PartialBlock } from '@blocknote/core'
import { useCallback } from 'react'
import useLocalForage from './useLocalForage'

const EDITOR_CONTENT_KEY = 'editorContent'

export function useEditorStorage() {
    const { saveToForage, loadFromForage } = useLocalForage()

    const saveContent = useCallback(async (jsonBlocks: Block[]) => {
        await saveToForage<string, Block[]>(EDITOR_CONTENT_KEY, jsonBlocks)
    }, [])

    const loadContent = useCallback(async () => {
        return await loadFromForage<string, PartialBlock[]>('editorContent')
    }, [])

    return { saveContent, loadContent }
}
