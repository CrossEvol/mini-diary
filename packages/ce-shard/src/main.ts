export const isEmpty = (data: any) => data === null || data === undefined

export const isObject = (data: any) => data && typeof data === 'object'

export const isBlank = (data: any) =>
    isEmpty(data) ||
    (Array.isArray(data) && data.length === 0) ||
    (isObject(data) && Object.keys(data).length === 0) ||
    (typeof data === 'string' && data.trim().length === 0)

export const sayHi = (data: string) => {
    console.log(`Hello, ${data}`)
}

export * from './shared/constants'

export * from './shared/types'

