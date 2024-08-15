import { getReasonPhrase, getStatusCode, StatusCodes } from 'http-status-codes'

export const okResponse = <T>(data: T) => {
    return {
        status: StatusCodes.OK,
        message: getReasonPhrase(StatusCodes.OK),
        data,
    }
}

export const failResponse = (message?: string) => {
    return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: !message
            ? getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)
            : message,
        data: null,
    }
}

export const getSafeStatusCode = (reasonPhrase: string) => {
    try {
        const statusCode = getStatusCode(reasonPhrase)
        return statusCode
    } catch (error) {
        return StatusCodes.INTERNAL_SERVER_ERROR
    }
}
