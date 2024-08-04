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
