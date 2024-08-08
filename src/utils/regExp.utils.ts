export const extractDataByDiaryKey = (str: string) => {
    const match = str.match(/^(\w+)-(\d+)-(\d{4}-\d{2}-\d{2})$/)

    if (match) {
        const category = match[1]
        const userId = match[2]
        const date = match[3]

        return { category, userId: Number(userId), date }
    } else {
        return null // Or handle invalid format
    }
}

export const isEditorRoute = (str: string) => {
    const regex = /editor\/\d{4}-\d{2}-\d{2}$/
    return regex.test(str)
}

export const extraDateFromEditorRoute = (str: string) => {
    const regex = new RegExp(/(\d{4}-\d{2}-\d{2})$/)
    const match = str.match(regex)
    if (match) {
        return new Date(match[1])
    } else {
        return null
    }
}
