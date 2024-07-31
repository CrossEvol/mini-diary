import { Block, PartialBlock } from '@blocknote/core'
import { useCallback } from 'react'
import useLocalForage from './useLocalForage'

export function useEditorStorage() {
    const { saveToForage, loadFromForage } = useLocalForage()

    const saveContent = useCallback(async (key:string,jsonBlocks: Block[]) => {
        await saveToForage<string, Block[]>(key, jsonBlocks)
    }, [])

    const loadContent = useCallback(async (key:string) => {
        return await loadFromForage<string, PartialBlock[]>(key)
    }, [])

    return { saveContent, loadContent }
}
