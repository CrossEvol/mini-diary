import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import useAuthRoute from './handlers/auth.route.handler'
import useDiariesRoute from './handlers/diaries.route.handler'
import useExampleRoute from './handlers/example.route.handler'
import useStorageRoute from './handlers/storage.route.handler'
import useUsersRoute from './handlers/users.route.handler'
import { bearerAuth } from './middlewares'
import { getSafeStatusCode } from './server.aux'

const app = new OpenAPIHono<{ Variables: { userID: number } }, any, any>()

export type HonoApp = typeof app

app.use(logger())
app.use('*', async (c, next) => {
    const corsMiddlewareHandler = cors({
        origin: '*',
    })
    return corsMiddlewareHandler(c, next)
})
app.use('*', bearerAuth)

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

useExampleRoute(app)
useAuthRoute(app)
useUsersRoute(app)
useDiariesRoute(app)
useStorageRoute(app)

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
