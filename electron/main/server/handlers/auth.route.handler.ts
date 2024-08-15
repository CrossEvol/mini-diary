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
import { failResponse, okResponse } from '../server.aux'

const useAuthRoute = (app: HonoApp) => {
    app.openapi(
        createRoute({
            method: 'get',
            path: '/profile',
            tags: ['Auth'],
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
            return c.json(okResponse<UserProfile | null>(user), StatusCodes.OK)
        }
    )

    app.openapi(
        createRoute({
            method: 'post',
            path: '/auth/sign-up',
            tags: ['Auth'],
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
                    description: 'Create new User Success.',
                    content: {
                        'application/json': {
                            schema: ZResultSchema(
                                UserProfileSchema.nullable().optional()
                            ),
                        },
                    },
                },
                500: {
                    description: 'Create new User Failed.',
                    content: {
                        'application/json': {
                            schema: ZResultSchema(z.null()),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const { email, nickname, password, pinCode } =
                await c.req.json<Omit<User, 'id' | 'avatar'>>()
            const user = await createUser({
                email,
                nickname,
                password,
                pinCode,
            })

            if (user === null) {
                return c.json(
                    failResponse('sign-up failed. can not create new user.'),
                    StatusCodes.INTERNAL_SERVER_ERROR
                )
            }
            return c.json(
                okResponse<UserProfile>({
                    id: user.id,
                    email: user.email,
                    nickname: user.nickname,
                    pinCode: user.pinCode,
                    avatar: user.avatar,
                }),
                StatusCodes.OK
            )
        }
    )

    app.openapi(
        createRoute({
            method: 'post',
            path: '/auth/sign-in',
            tags: ['Auth'],
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
                400: {
                    description: 'Password not match.',
                    content: {
                        'application/json': {
                            schema: ZResultSchema(z.null()),
                        },
                    },
                },
                404: {
                    description: 'User not found',
                    content: {
                        'application/json': {
                            schema: ZResultSchema(z.null()),
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
                return c.json(
                    failResponse(ErrorCause.USER_NOT_FOUND),
                    StatusCodes.NOT_FOUND
                )
            }
            if (user.password !== password) {
                return c.json(
                    failResponse(ErrorCause.PASSWORD_MISMATCH),
                    StatusCodes.BAD_REQUEST
                )
            }
            const jwt = createJWT({
                userID: user.id,
                nickname: user.nickname,
            })
            return c.json(okResponse({ token: jwt }), StatusCodes.OK)
        }
    )
}

export default useAuthRoute
