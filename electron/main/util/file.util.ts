import { sep } from 'path'

const dateRegex = /(\d{4}-\d{2}-\d{2})/

export const extraDateFromPath = (path: string) => {
    const filename = path.substring(path.lastIndexOf(sep) - 1)
    const matches = filename.match(dateRegex)
    if (matches) {
        return matches[1]
    }

    return ''
}
