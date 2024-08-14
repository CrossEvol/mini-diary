import { createRoute, z } from '@hono/zod-openapi'
import { getUsersWithProjects } from '../../database/database'
import { UserJoin, UserJoinSchema, ZResultSchema } from '../api.type'
import { HonoApp } from '../hono.app'
import { okResponse } from '../server.aux'

const useExampleRoute = (app: HonoApp) => {
    app.openapi(
        createRoute({
            method: 'get',
            path: '/hello',
            responses: {
                200: {
                    description: 'Respond a message',
                    content: {
                        'application/json': {
                            schema: ZResultSchema(z.string()),
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
                            schema: ZResultSchema(UserJoinSchema),
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
}

export default useExampleRoute
