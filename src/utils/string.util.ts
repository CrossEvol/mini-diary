export const createDiaryKey = (userID: number, date: string) =>
    `diary-${userID}-${date}`

export const createDiaryPath = (username: string, date: string) =>
    `diary-${username}-${date}`

export const ApiUrl = () =>
    `http://localhost:${localStorage.getItem('port') ?? 3000}`
