import { readFileSync } from 'fs'
import jwt, { JsonWebTokenError, JwtPayload, SignOptions } from 'jsonwebtoken'

const privateKey = readFileSync('private.key')
const cert = readFileSync('public.pem')

export const createJWT = (
    payload: Record<string, any>,
    options?: Omit<SignOptions, 'algorithm' | 'subject'>
) => {
    const token = jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '30 days',
        subject: 'userID',
        ...options,
    })
    return token
}

export const decodeJWT = (token: string) => {
    try {
        const jwtPayload = jwt.verify(token, cert)
        return jwtPayload
    } catch (error) {
        console.error(error)
        throw new JsonWebTokenError('Decode jwt error')
    }
}

export const getFromJWT = <T>(token: string, key: string) => {
    const jwtPayload = decodeJWT(token) as JwtPayload
    return (jwtPayload[key] as T) ?? null
}
