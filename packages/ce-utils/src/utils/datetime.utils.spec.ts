import { describe, expect, it } from 'vitest'
import {
    compareDateStrings,
    DateTimeFormatEnum,
    formatDateTime,
    parseDateTime,
} from './datetime.utils'

describe('DateTimeUtils', () => {
    it('Format and parse date with default format', () => {
        const testDate = new Date('December 17, 1995 03:24:00')
        const formatted = formatDateTime(testDate)
        expect(formatted).toBe('1995-12-17 03:24:00 AM')
        const parsed = parseDateTime(formatted).toDate()
        expect(parsed).toEqual(testDate)
    })

    it('Format and parse date with FULL_DATE_TIME_FORMAT', () => {
        const testDate = new Date('December 17, 1995 03:24:00')
        const formatted = formatDateTime(
            testDate,
            DateTimeFormatEnum.FULL_DATE_TIME_FORMAT
        )
        expect(formatted).toBe('Sunday, December 17, 1995 3:24:00 AM')
        const parsed = parseDateTime(
            formatted,
            DateTimeFormatEnum.FULL_DATE_TIME_FORMAT
        ).toDate()
        expect(parsed).toEqual(testDate)
    })

    it('Format and parse date with TIME_24H_FORMAT', () => {
        const testDate = new Date('December 17, 1995 15:24:00')
        const formatted = formatDateTime(
            testDate,
            DateTimeFormatEnum.TIME_24H_FORMAT
        )
        expect(formatted).toBe('15:24')
        const currentDate = new Date()
        const expectedDate = new Date(currentDate.setHours(15, 24, 0, 0)) // Assumes today's date with time 15:24
        const parsed = parseDateTime(
            formatted,
            DateTimeFormatEnum.TIME_24H_FORMAT
        ).toDate()
        expect(parsed).toEqual(expectedDate)
    })

    it('Format and parse date with TIME_12H_FORMAT', () => {
        const testDate = new Date('December 17, 1995 03:24:00')
        const formatted = formatDateTime(
            testDate,
            DateTimeFormatEnum.TIME_12H_FORMAT
        )
        expect(formatted).toBe('3:24 AM')
        const currentDate = new Date()
        const expectedDate = new Date(currentDate.setHours(3, 24, 0, 0)) // Assumes today's date with time 03:24 AM
        const parsed = parseDateTime(
            formatted,
            DateTimeFormatEnum.TIME_12H_FORMAT
        ).toDate()
        expect(parsed).toEqual(expectedDate)
    })

    it('Format and parse date with DAY_FORMAT', () => {
        const testDate = new Date('July 29, 2024')
        const formatted = formatDateTime(
            testDate,
            DateTimeFormatEnum.DAY_FORMAT
        )
        expect(formatted).toBe('Mon, 07/29/2024')
        const parsed = parseDateTime(
            formatted,
            DateTimeFormatEnum.DAY_FORMAT
        ).toDate()
        expect(parsed).toEqual(testDate)
    })
})

describe('compareDateStrings', () => {
    it('should return 1 when the first date is later', () => {
        expect(compareDateStrings('2024-08-17', '2024-08-16')).toBe(1)
    })

    it('should return -1 when the first date is earlier', () => {
        expect(compareDateStrings('2024-08-16', '2024-08-17')).toBe(-1)
    })

    it('should return 0 when both dates are the same', () => {
        expect(compareDateStrings('2024-08-17', '2024-08-17')).toBe(0)
    })

    it('should handle different months correctly', () => {
        expect(compareDateStrings('2024-07-17', '2024-08-17')).toBe(-1)
        expect(compareDateStrings('2024-09-17', '2024-08-17')).toBe(1)
    })

    it('should handle different years correctly', () => {
        expect(compareDateStrings('2023-08-17', '2024-08-17')).toBe(-1)
        expect(compareDateStrings('2025-08-17', '2024-08-17')).toBe(1)
    })
})
