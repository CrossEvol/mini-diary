import { useCallback } from 'react'
import useLocalForage from './useLocalForage'

const IMPORT_CONTENT = 'IMPORT_CONTENT'

export function useImportContentStorage() {
  const { saveToForage, loadFromForage, removeFromForage } = useLocalForage()

  const saveImportContent = useCallback(
    async (content: string) => {
      await saveToForage<string, string>(IMPORT_CONTENT, content)
    },
    [saveToForage]
  )

  const loadImportContent = useCallback(async () => {
    return await loadFromForage<string, string>(IMPORT_CONTENT)
  }, [loadFromForage])

  const removeImportContent = useCallback(async () => {
    return await removeFromForage(IMPORT_CONTENT)
  }, [removeFromForage])

  return { saveImportContent, loadImportContent, removeImportContent }
}
