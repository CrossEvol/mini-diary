import { describe, it, expect } from 'vitest'
import { extractDataByDiaryKey } from './regExp.utils' // Replace with actual file path

describe('extractDataByDiaryKey', () => {
    it('should extract data correctly from valid string', () => {
        const str = 'expense-123-2023-11-22'
        const expectedData = {
            category: 'expense',
            userId: 123,
            date: '2023-11-22',
        }
        const result = extractDataByDiaryKey(str)
        expect(result).toEqual(expectedData)
    })

    it('should return null for invalid string', () => {
        const str = 'invalid-format'
        const result = extractDataByDiaryKey(str)
        expect(result).toBeNull()
    })
})
