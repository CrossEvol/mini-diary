import { EFormat } from "@/shared/enums";

export const createDiaryKey = (userID: number, date: string) =>
    `diary-${userID}-${date}`

export const createDiaryPath = (username: string, date: string) =>
    `diary-${username}-${date}`

export const ApiUrl = () =>
    `http://localhost:${localStorage.getItem('port') ?? 3000}`

export const combineEditorContent = (
    format: EFormat,
    { previous, current }: { previous: string; current: string }
) => {
    switch (format) {
        case EFormat.HTML:
            return previous + current
        case EFormat.JSON:
            return JSON.stringify([
                ...JSON.parse(previous),
                ...JSON.parse(current),
            ])
        case EFormat.MARKDOWN:
            return previous + current
    }
}
