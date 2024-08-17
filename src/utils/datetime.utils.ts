import dayjs from 'dayjs'

// Define an enum for various date-time formats
export enum DateTimeFormatEnum {
    DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss A',
    DATE_FORMAT = 'YYYY-MM-DD',
    DAY_FORMAT = 'ddd, MM/DD/YYYY',
    TIME_FORMAT = 'HH:mm:ss A',
    FULL_DATE_TIME_FORMAT = 'dddd, MMMM D, YYYY h:mm:ss A', // e.g., "Monday, July 29, 2024 2:30:45 PM"
    SHORT_DATE_FORMAT = 'MMM D, YYYY', // e.g., "Jul 29, 2024"
    COMPACT_DATE_FORMAT = 'MM/DD/YYYY', // e.g., "07/29/2024"
    TIME_24H_FORMAT = 'HH:mm', // e.g., "14:30"
    TIME_12H_FORMAT = 'h:mm A', // e.g., "2:30 PM"
}

export const formatDateTime = (dateTime: Date, format?: DateTimeFormatEnum) => {
    return dayjs(dateTime).format(format ?? DateTimeFormatEnum.DATE_TIME_FORMAT)
}

export const parseDateTime = (
    parsedString: string,
    format?: DateTimeFormatEnum
) => {
    if (
        format === DateTimeFormatEnum.TIME_24H_FORMAT ||
        format === DateTimeFormatEnum.TIME_12H_FORMAT
    ) {
        const currentDate = dayjs(Date.now()).format(
            DateTimeFormatEnum.DATE_FORMAT
        )
        return dayjs(
            `${currentDate} ${parsedString}`,
            `${DateTimeFormatEnum.DATE_FORMAT} ${format}`
        )
    }

    return dayjs(parsedString, format ?? DateTimeFormatEnum.DATE_TIME_FORMAT)
}

export const compareDate = (a: string, b: string) => {
    return new Date(a).getMilliseconds() - new Date(b).getMilliseconds()
}
