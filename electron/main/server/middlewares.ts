import { Context, Next } from 'hono'
import { getFromJWT } from '../util/jwt.util'

const whiteList = ['/hello', '/ui', '/doc', '/auth/sign-in', '/auth/sign-up']

export const bearerAuth = async (c: Context, next: Next) => {
    if (whiteList.includes(c.req.path)) {
        await next()
    } else {
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
    }
}
