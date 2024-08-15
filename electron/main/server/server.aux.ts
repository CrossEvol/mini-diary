import { getReasonPhrase, getStatusCode, StatusCodes } from 'http-status-codes'
import { ZPageResult, ZResult } from './api.type'

export const okResponse = <T>(data: T) => {
    return {
        status: StatusCodes.OK,
        message: getReasonPhrase(StatusCodes.OK),
        data,
    } satisfies ZResult<T>
}

export const pageResponse = <T>(list: T[], total_count: number) => {
    return {
        status: StatusCodes.OK,
        message: getReasonPhrase(StatusCodes.OK),
        data: {
            list,
            total_count,
        },
    } satisfies ZPageResult<T>
}

export const failResponse = (message?: string) => {
    return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: !message
            ? getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            : message,
        data: null,
    } satisfies ZResult<null>
}

export const getSafeStatusCode = (reasonPhrase: string) => {
    try {
        const statusCode = getStatusCode(reasonPhrase)
        return statusCode
    } catch (error) {
        return StatusCodes.INTERNAL_SERVER_ERROR
    }
}
