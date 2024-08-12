import { EFormat } from '../shared/enums'

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
