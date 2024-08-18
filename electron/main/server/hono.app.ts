import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { findFreePort } from '../util/net.util'
import useAuthRoute from './handlers/auth.route.handler'
import useDiariesRoute from './handlers/diaries.route.handler'
import useExampleRoute from './handlers/example.route.handler'
import useStorageRoute from './handlers/storage.route.handler'
import useTodosRoute from './handlers/todos.route.handler'
import useUsersRoute from './handlers/users.route.handler'
import { bearerAuth, customHonoLogger } from './middlewares'
import { getSafeStatusCode } from './server.aux'

export const startHonoServer = async () => {
    const port = await findFreePort(3000, 8000)

    console.log(`Server is running on port ${port}`)

    serve({
        fetch: app.fetch,
        port,
    })

    return port
}

const app = new OpenAPIHono<{ Variables: { userID: number } }, any, any>()

export type HonoApp = typeof app

app.use(logger(customHonoLogger))
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
useTodosRoute(app)

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
