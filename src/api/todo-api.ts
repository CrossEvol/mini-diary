import fetchClient from '@/utils/fetch.client'
import { ApiUrl } from '@/utils/string.util'
import { GetTodosDTO, Todo, ZResult } from 'electron/main/server/api.type'

const getTodos = async (getTodosDTO: GetTodosDTO) => {
    const response = await fetchClient.get<ZResult<Todo[]>>(
        // `${ApiUrl('todos')}?${queryString.stringify(getTodosDTO)}`,
        `${ApiUrl('todos', getTodosDTO)}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }
    )
    if (response.status === 200) {
        return response.data
    } else {
        return []
    }
}

export const exchangeTodoOrder = async (firstTodo: Todo, secondTodo: Todo) => {
    const resp = await Promise.all([
        await fetchClient.patch<ZResult<Todo>>(
            `${ApiUrl(`todos/${firstTodo.id}`)}`,
            {
                body: JSON.stringify({
                    order: firstTodo.order,
                }),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        ),

        await fetchClient.patch<ZResult<Todo>>(
            `${ApiUrl(`todos/${secondTodo.id}`)}`,
            {
                body: JSON.stringify({
                    order: secondTodo.order,
                }),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        ),
    ])
    if (resp.map((r) => r.status).every((status) => status === 200)) {
        return true
    } else {
        return false
    }
}

export default {
    getTodos,
    exchangeTodoOrder,
}
