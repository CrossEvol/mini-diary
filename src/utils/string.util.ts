export const createDiaryKey = (userID: number, date: string) =>
    `diary-${userID}-${date}`

export const createDiaryPath = (username: string, date: string) =>
    `diary-${username}-${date}`
