import { createRoute, z } from '@hono/zod-openapi'
import { StatusCodes } from 'http-status-codes'
import { getUsersWithProjects } from '../../database/database'
import { UserJoin, UserJoinSchema, ZResultSchema } from '../api.type'
import { HonoApp } from '../hono.app'
import { okResponse } from '../server.aux'

const useExampleRoute = (app: HonoApp) => {
    app.openapi(
        createRoute({
            method: 'get',
            path: '/hello',
            tags: ['Example'],
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
            return c.json(okResponse<string>('hello'), StatusCodes.OK)
        }
    )

    app.openapi(
        createRoute({
            method: 'get',
            path: '/users',
            tags: ['Example'],
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

            return c.json(okResponse<UserJoin>(res), StatusCodes.OK)
        }
    )
}

export default useExampleRoute
