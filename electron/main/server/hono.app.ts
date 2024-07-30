import { swaggerUI } from '@hono/swagger-ui'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { createUser, getUsersWithProjects } from '../database/database'
import { User, UserJoinSchema, UserSchema } from './zod.type'

const app = new OpenAPIHono()

app.use('*', async (c, next) => {
    const corsMiddlewareHandler = cors({
        origin: '*',
    })
    return corsMiddlewareHandler(c, next)
})

app.openapi(
    createRoute({
        method: 'get',
        path: '/hello',
        responses: {
            200: {
                description: 'Respond a message',
                content: {
                    'application/json': {
                        schema: z.object({
                            message: z.string(),
                        }),
                    },
                },
            },
        },
    }),
    (c) => {
        return c.json({
            message: 'hello',
        })
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
                        schema: z.object({
                            data: UserJoinSchema,
                        }),
                    },
                },
            },
        },
    }),
    async (c) => {
        const res = await getUsersWithProjects()

        return c.json({ data: res })
    }
)

app.openapi(
    createRoute({
        method: 'post',
        path: '/users',
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
                        schema: z.object({
                            data: UserSchema.optional().nullable(),
                        }),
                    },
                },
            },
        },
    }),
    async (c) => {
        const { nickName, password, pinCode } =
            await c.req.json<Omit<User, 'id' | 'avatar'>>()
        const user = await createUser(nickName!, password!, pinCode!)
        return c.json({ data: user })
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
