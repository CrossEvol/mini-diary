import { createRoute, z } from '@hono/zod-openapi'
import { StatusCodes } from 'http-status-codes'
import {
    countTodos,
    createTodo,
    deleteTodo,
    getAllTodos,
    updateTodo,
} from '../../database/database'
import { STR_1999_09_09 } from '../../shared/constants/date-constants'
import {
    CreateTodoDTO,
    CreateTodoSchema,
    Todo,
    TodoSchema,
    UpdateTodoDTO,
    UpdateTodoSchema,
    ZPageResultSchema,
    ZResultSchema
} from '../api.type'
import { HonoApp } from '../hono.app'
import { okResponse, pageResponse } from '../server.aux'

const useTodosRoute = (app: HonoApp) => {
    app.openapi(
        createRoute({
            method: 'get',
            path: '/todos',
            tags: ['Todo'],
            security: [
                {
                    AuthorizationBearer: [], // <- Add security name (must be same)
                },
            ],
            request: {
                query: z.object({
                    q: z
                        .string()
                        .optional()
                        .openapi({
                            param: {
                                name: 'q',
                                in: 'query',
                                required: false,
                            },
                            type: 'string',
                            example: undefined,
                        }),
                    startDay: z
                        .string()
                        .optional()
                        .openapi({
                            param: {
                                name: 'startDay',
                                in: 'query',
                                required: false,
                            },
                            type: 'string',
                            example: '2024-07-31',
                        }),
                    endDay: z
                        .string()
                        .optional()
                        .openapi({
                            param: {
                                name: 'endDay',
                                in: 'query',
                                required: false,
                            },
                            type: 'string',
                            example: '2024-08-30',
                        }),
                }),
            },
            responses: {
                200: {
                    description: 'Respond a message',
                    headers: z.object({
                        'Total-Count': z.number(),
                    }),
                    content: {
                        'application/json': {
                            schema: ZPageResultSchema(TodoSchema),
                        },
                    },
                },
            },
        }),
        (c) => {
            const userID = c.get('userID')
            const { q, startDay, endDay } = c.req.valid('query')
            // TODO:use prettier to let
            const paramsForWhere = {
                q,
                startDay: !!startDay
                    ? startDay === STR_1999_09_09
                        ? undefined
                        : new Date(startDay!)
                    : undefined,
                endDay: !!endDay
                    ? endDay === STR_1999_09_09
                        ? undefined
                        : new Date(endDay)
                    : undefined,
            }
            const todos = getAllTodos(userID, paramsForWhere)
            const count = countTodos(userID, paramsForWhere)
            c.header('Total-Count', count.toString())
            return c.json(pageResponse<Todo>(todos, count), StatusCodes.OK)
        }
    )

    app.openapi(
        createRoute({
            method: 'post',
            path: '/todos',
            tags: ['Todo'],
            security: [
                {
                    AuthorizationBearer: [], // <- Add security name (must be same)
                },
            ],
            request: {
                body: {
                    content: {
                        'application/json': {
                            schema: CreateTodoSchema.openapi({
                                required: ['text', 'deadline'],
                            }),
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Create Todo with Text and default Deadline',
                    content: {
                        'application/json': {
                            schema: ZResultSchema(TodoSchema.nullable()),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const userID = c.get('userID')
            const createTodoDTO = await c.req.json<CreateTodoDTO>()
            const todo = createTodo(userID, {
                ...createTodoDTO,
                deadline: new Date(createTodoDTO.deadline),
            })
            return c.json(okResponse<Todo | null>(todo), StatusCodes.OK)
        }
    )

    app.openapi(
        createRoute({
            method: 'patch',
            path: '/todos/{id}',
            tags: ['Todo'],
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
                            schema: UpdateTodoSchema.openapi({}),
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Partial Update Todo',
                    content: {
                        'application/json': {
                            schema: ZResultSchema(TodoSchema.nullable()),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const userID = c.get('userID')
            const { id: todoID } = c.req.valid('param')
            const updateTodoDTO = await c.req.json<UpdateTodoDTO>()
            const todo = updateTodo(Number(todoID), userID, {
                ...updateTodoDTO,
                deadline: !!updateTodoDTO.deadline
                    ? new Date(updateTodoDTO.deadline!)
                    : undefined,
            })
            return c.json(okResponse<Todo | null>(todo), StatusCodes.OK)
        }
    )

    app.openapi(
        createRoute({
            method: 'delete',
            path: '/todos/{id}',
            tags: ['Todo'],
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
            },
            responses: {
                200: {
                    description: 'Delete Todo',
                    content: {
                        'application/json': {
                            schema: ZResultSchema(TodoSchema.nullable()),
                        },
                    },
                },
            },
        }),
        async (c) => {
            const userID = c.get('userID')
            const { id: todoID } = c.req.valid('param')
            const todo = deleteTodo(Number(todoID), userID)
            return c.json(okResponse<Todo | null>(todo), StatusCodes.OK)
        }
    )
}

export default useTodosRoute
