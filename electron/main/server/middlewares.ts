import { Context, Next } from 'hono'
import logger from '../logging/winston.util'
import { getFromJWT } from '../util/jwt.util'

const whiteList = [
    '/hello',
    '/ui',
    '/doc',
    '/auth/sign-in',
    '/auth/sign-up',
    '/favicon.ico',
]

const permissiveRegExp = ['/static/*', '/dl/*'].map((s) => new RegExp(s))

export const bearerAuth = async (c: Context, next: Next) => {
    if (permissiveRegExp.filter((r) => r.test(c.req.path)).length > 0) {
        await next()
        return
    }

    if (whiteList.includes(c.req.path)) {
        await next()
        return
    }

    const authorization = c.req.header('Authorization')
    const bearerRegex = /^Bearer\s+(\S+)$/
    const match = authorization?.match(bearerRegex)

    if (match) {
        const token = match[1]
        const userID = getFromJWT<number>(token, 'userID')
        c.set('userID', userID)
    } else {
        throw new Error('Invalid authorization header')
    }
    await next()
    return
}

export const customHonoLogger = (message: string, ...rest: string[]) => {
    logger.info(rest.length > 0 ? [message, ...rest] : message)
}
