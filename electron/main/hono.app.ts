import { swaggerUI } from '@hono/swagger-ui'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { insertUserWithProject } from './database'
import { UserSchema } from './zod.type'
import { cors } from 'hono/cors'

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
                description: 'Create new User with Project',
                content: {
                    'application/json': {
                        schema: z.object({
                            data: z.array(UserSchema),
                        }),
                    },
                },
            },
        },
    }),
    async (c) => {
        const res = await insertUserWithProject()

        return c.json({ data: res })
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
