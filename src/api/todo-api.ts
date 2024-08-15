import fetchClient from '@/utils/fetch.client'
import { ApiUrl } from '@/utils/string.util'
import { GetTodosDTO, Todo, ZResult } from 'electron/main/server/api.type'
import queryString from 'query-string'

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

export default {
    getTodos,
}
