import { swaggerUI } from '@hono/swagger-ui'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { getReasonPhrase, getStatusCode, StatusCodes } from 'http-status-codes'
import {
    createDiary,
    createUser,
    getAllDiaryIDs,
    getUserByEmail,
    getUserByUserID,
    getUsersWithProjects,
    updateDiary,
} from '../database/database'
import { DateTimeFormatEnum, formatDateTime } from '../util/datetime.utils'
import { createJWT } from '../util/jwt.util'
import { ErrorCause } from './error'
import { bearerAuth } from './middlewares'
import {
    Diary,
    DiarySync,
    DiarySyncOutput,
    DiarySyncOutputSchema,
    DiarySyncSchema,
    ResultSchema,
    User,
    UserJoin,
    UserJoinSchema,
    UserProfile,
    UserProfileSchema,
    UserSchema,
} from './zod.type'

const okResponse = <T>(data: T) => {
    return {
        status: StatusCodes.OK,
        message: getReasonPhrase(StatusCodes.OK),
        data,
    }
}

const app = new OpenAPIHono<{ Variables: { userID: number } }, any, any>()

app.use(logger())
app.use('*', async (c, next) => {
    const corsMiddlewareHandler = cors({
        origin: '*',
    })
    return corsMiddlewareHandler(c, next)
})
app.use('*', bearerAuth)

const getSafeStatusCode = (reasonPhrase: string) => {
    try {
        const statusCode = getStatusCode(reasonPhrase)
        return statusCode
    } catch (error) {
        return StatusCodes.INTERNAL_SERVER_ERROR
    }
}

app.onError((err, c) => {
    console.error(`${err}`)

    return c.json({
        status: getSafeStatusCode(err.message),
        message: `error: ${err.message}`,
        data: null,
    })
})

// Security (Bearer)
// Register security scheme
// add it on your index.ts
app.openAPIRegistry.registerComponent(
    'securitySchemes',
    'AuthorizationBearer', // <- Add security name
    {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    }
)

app.openapi(
    createRoute({
        method: 'get',
        path: '/hello',
        responses: {
            200: {
                description: 'Respond a message',
                content: {
                    'application/json': {
                        schema: ResultSchema(z.string()),
                    },
                },
            },
        },
    }),
    (c) => {
        return c.json(okResponse<string>('hello'))
    }
)

app.openapi(
    createRoute({
        method: 'get',
        path: '/users',
        responses: {
            200: {
                description: 'Get Users with Projects',
                content: {
                    'application/json': {
                        schema: ResultSchema(UserJoinSchema),
                    },
                },
            },
        },
    }),
    async (c) => {
        const res = await getUsersWithProjects()

        return c.json(okResponse<UserJoin>(res))
    }
)

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
                        schema: ResultSchema(UserProfileSchema.nullable()),
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
                        schema: ResultSchema(
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
                        schema: ResultSchema(z.object({ token: z.string() })),
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
        const jwt = createJWT({ userID: user.id!, nickname: user.nickname! })
        return c.json(okResponse({ token: jwt }))
    }
)

app.openapi(
    createRoute({
        method: 'put',
        path: '/diaries',
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: z.array(DiarySyncSchema),
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Respond a message',
                content: {
                    'application/json': {
                        schema: ResultSchema(DiarySyncOutputSchema),
                    },
                },
            },
        },
    }),
    async (c) => {
        const diaries = (await c.req.json<DiarySync[]>()).map((d) => ({
            ...d,
            createdAt: formatDateTime(
                new Date(d.createdAt),
                DateTimeFormatEnum.DATE_FORMAT
            ),
        }))
        const userID = c.get('userID')
        const diaryIDs = await getAllDiaryIDs(userID)
        const diaryIdMap = diaryIDs.reduce((acc, cur) => {
            acc.set(
                formatDateTime(cur.createdAt!, DateTimeFormatEnum.DATE_FORMAT),
                cur
            )
            return acc
        }, new Map<string, Pick<Diary, 'id' | 'createdAt'>>())
        const existedDates = diaryIDs
            .map((d) => d.createdAt)
            .filter((d) => d !== null)
            .map((e) => formatDateTime(e, DateTimeFormatEnum.DATE_FORMAT))
        const createdDiaries = await Promise.all(
            diaries
                .filter((d) => !existedDates.includes(d.createdAt!))
                .map(
                    async (d) =>
                        await createDiary(
                            userID,
                            d.content,
                            new Date(d.createdAt!)
                        )
                )
        )
        const updatedDiaries = await Promise.all(
            diaries
                .filter((d) => existedDates.includes(d.createdAt!))
                .map(
                    async (d) =>
                        await updateDiary(
                            diaryIdMap.get(d.createdAt!)!.id,
                            d.content
                        )
                )
        )

        return c.json(
            okResponse<DiarySyncOutput>({
                createdCount: createdDiaries.length,
                updatedCount: updatedDiaries.length,
            })
        )
    }
)

app.get(
    '/ui',
    swaggerUI({
        url: '/doc',
    })
)

app.doc('/doc', {
    info: {
        title: 'An API',
        version: 'v1',
    },
    openapi: '3.1.0',
})

// Export the Hono app
export default app
