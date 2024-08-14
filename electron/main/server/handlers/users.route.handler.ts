import { createRoute, z } from '@hono/zod-openapi'
import { StatusCodes } from 'http-status-codes'
import { updateUser } from '../../database/database'
import {
    User,
    UserProfile,
    UserProfileSchema,
    UserSchema,
    ZResultSchema,
} from '../api.type'
import { HonoApp } from '../hono.app'
import { okResponse } from '../server.aux'

const useUsersRoute = (app: HonoApp) => {
    app.openapi(
        createRoute({
            method: 'put',
            path: '/users/{id}',
            tags: ['User'],
            security: [
                {
                    AuthorizationBearer: [], // <- Add security name (must be same)
                },
            ],
            request: {
                params: z.object({
                    id: z.string().openapi({
                        param: {
                            name: 'id',
                            in: 'path',
                        },
                        type: 'integer', // <- you can still add type by adding key type
                        example: '1',
                    }),
                }),
                body: {
                    content: {
                        'application/json': {
                            schema: UserSchema.omit({
                                id: true,
                            }),
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Update User',
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
            const { id } = c.req.valid('param')
            const { email, nickname, password, pinCode, avatar } =
                await c.req.json<Omit<User, 'id'>>()
            const user = await updateUser(Number(id), {
                email: email!,
                nickname: nickname!,
                password: password!,
                pinCode: pinCode!,
                avatar: avatar!,
            })
            return c.json(
                okResponse<UserProfile>({
                    id: user!.id,
                    email: user!.email,
                    nickname: user!.nickname,
                    pinCode: user!.pinCode,
                    avatar: user!.avatar,
                }),
                StatusCodes.OK
            )
        }
    )
}

export default useUsersRoute
