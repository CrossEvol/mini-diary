import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'fs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { createJWT, decodeJWT, getFromJWT } from './jwt.util'

let privateKey: Buffer
let cert: Buffer

beforeAll(() => {
    // Load keys for signing and verifying JWT
    privateKey = readFileSync('private.key')
    cert = readFileSync('public.pem')
})

describe('JWT Utility Functions', () => {
    describe('createJWT', () => {
        it('should create a valid JWT token', () => {
            const payload = { userId: '12345' }
            const token = createJWT(payload)
            const decoded = jwt.verify(token, cert) as JwtPayload

            expect(decoded.userId).toBe(payload.userId)
            expect(decoded).toHaveProperty('sub', 'userID')
        })
    })

    describe('decodeJWT', () => {
        it('should decode a valid token', () => {
            const payload = { userId: '12345' }
            const token = jwt.sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '30 days',
                subject: 'userID',
            })
            const decoded = decodeJWT(token) as JwtPayload

            expect(decoded.userId).toBe(payload.userId)
            expect(decoded).toHaveProperty('sub', 'userID')
        })

        it('should throw an error for an invalid token', () => {
            const invalidToken = 'invalid.token.here'

            expect(() => decodeJWT(invalidToken)).toThrowError(
                'Decode jwt error'
            )
        })
    })

    describe('getFromJWT', () => {
        it('should return the value for a given key', () => {
            const payload = { userId: '12345', role: 'admin' }
            const token = jwt.sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '30 days',
                subject: 'userID',
            })
            const userId = getFromJWT(token, 'userId')
            const role = getFromJWT(token, 'role')

            expect(userId).toBe('12345')
            expect(role).toBe('admin')
        })

        it('should return null if the key does not exist', () => {
            const payload = { userId: '12345' }
            const token = jwt.sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '30 days',
                subject: 'userID',
            })
            const nonExistentKey = getFromJWT(token, 'nonExistentKey')

            expect(nonExistentKey).toBeNull()
        })
    })
})
