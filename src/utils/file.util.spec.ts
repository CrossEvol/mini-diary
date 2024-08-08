import { EFormat } from '@/shared/enums'
import { describe, expect, it } from 'vitest'
import { verifyContentFormat } from './file.util'

// Mock content for testing
const jsonContent = '{"name": "John", "age": 30}'
const htmlContent = '<html><body><h1>Hello World</h1></body></html>'
const markdownContent = '# Hello World\nThis is a markdown content'
const invalidContent = 'This is just a plain text'

describe('verifyContentFormat', () => {
    it('should return JSON format for valid JSON content', () => {
        const result = verifyContentFormat(jsonContent)
        expect(result).toBe(EFormat.JSON)
    })

    it('should return HTML format for valid HTML content', () => {
        const result = verifyContentFormat(htmlContent)
        expect(result).toBe(EFormat.HTML)
    })

    it('should return MARKDOWN format for valid Markdown content', () => {
        const result = verifyContentFormat(markdownContent)
        expect(result).toBe(EFormat.MARKDOWN)
    })

    it('should return MARKDOWN format for invalid content', () => {
        const result = verifyContentFormat(invalidContent)
        expect(result).toBe(EFormat.MARKDOWN)
    })
})
