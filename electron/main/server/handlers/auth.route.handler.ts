import { createRoute, z } from '@hono/zod-openapi'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'
import {
    createUser,
    getUserByEmail,
    getUserByUserID,
} from '../../database/database'
import { createJWT } from '../../util/jwt.util'
import {
    User,
    UserProfile,
    UserProfileSchema,
    UserSchema,
    ZResultSchema,
} from '../api.type'
import { ErrorCause } from '../error'
import { HonoApp } from '../hono.app'
import { okResponse } from '../server.aux'

const useAuthRoute = (app: HonoApp) => {
    app.openapi(
        createRoute({
            method: 'get',
            path: '/profile',
            security: [
                {
                    AuthorizationBearer: [], // <- Add security name (must be same)
                },
            ],
            responses: {
                200: {
                    description: 'Get UserProfile by Bearer Auth',
                    content: {
                        'application/json': {
                            schema: ZResultSchema(UserProfileSchema.nullable()),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const userID = c.get('userID')
            const user = await getUserByUserID(userID!)
            return c.json(okResponse<UserProfile | null>(user))
        }
    )

    app.openapi(
        createRoute({
            method: 'post',
            path: '/auth/sign-up',
            request: {
                body: {
                    content: {
                        'application/json': {
                            schema: UserSchema.omit({
                                id: true,
                                avatar: true,
                            }),
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Create new User',
                    content: {
                        'application/json': {
                            schema: ZResultSchema(
                                UserProfileSchema.nullable().optional()
                            ),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const { email, nickname, password, pinCode } =
                await c.req.json<Omit<User, 'id' | 'avatar'>>()
            const user = await createUser({
                email: email!,
                nickname: nickname!,
                password: password!,
                pinCode: pinCode!,
            })
            return c.json(
                okResponse<UserProfile>({
                    id: user!.id,
                    email: user!.email,
                    nickname: user!.nickname,
                    pinCode: user!.pinCode,
                    avatar: user!.avatar,
                })
            )
        }
    )

    app.openapi(
        createRoute({
            method: 'post',
            path: '/auth/sign-in',
            request: {
                body: {
                    content: {
                        'application/json': {
                            schema: UserSchema.pick({
                                email: true,
                                password: true,
                            }),
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Sign In',
                    content: {
                        'application/json': {
                            schema: ZResultSchema(
                                z.object({ token: z.string() })
                            ),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const { email, password } =
                await c.req.json<Pick<User, 'email' | 'password'>>()
            const user = await getUserByEmail(email!)
            if (!user) {
                throw new Error(getReasonPhrase(StatusCodes.NOT_FOUND))
            }
            if (user.password !== password) {
                throw new Error(ErrorCause.PASSWORD_MISMATCH)
            }
            const jwt = createJWT({
                userID: user.id!,
                nickname: user.nickname!,
            })
            return c.json(okResponse({ token: jwt }))
        }
    )
}

export default useAuthRoute
