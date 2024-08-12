import { EFormat } from '@/shared/enums'
import { describe, expect, test } from 'vitest'
import { combineEditorContent } from './string.util'

describe('combineEditorContent', () => {
    test('should concatenate HTML content', () => {
        const previous = '<p>Hello</p>'
        const current = '<p>World</p>'
        const expected = '<p>Hello</p><p>World</p>'

        const result = combineEditorContent(EFormat.HTML, { previous, current })

        expect(result).toBe(expected)
    })

    test('should combine JSON arrays', () => {
        const previous = '[1, 2]'
        const current = '[3, 4]'
        const expected = '[1,2,3,4]'

        const result = combineEditorContent(EFormat.JSON, { previous, current })

        expect(result).toBe(expected)
    })

    test('should concatenate Markdown content', () => {
        const previous = '# Heading 1\n'
        const current = '# Heading 2\n'
        const expected = '# Heading 1\n# Heading 2\n'

        const result = combineEditorContent(EFormat.MARKDOWN, {
            previous,
            current,
        })

        expect(result).toBe(expected)
    })
})
