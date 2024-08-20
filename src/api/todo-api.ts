import fetchClient from '@/utils/fetch.client'
import { ApiUrl } from '@/utils/string.util'
import {
  CreateTodoDTO,
  GetTodosDTO,
  Todo,
  UpdateTodoDTO,
  ZPageResult,
  ZResult
} from 'electron/main/server/api.type'

const getTodos = async (getTodosDTO: GetTodosDTO) => {
  const response = await fetchClient.get<ZPageResult<Todo>>(
    `${ApiUrl('todos', getTodosDTO)}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  )
  if (response.status === 200) {
    return response.data
  } else {
    return { list: [], total_count: 0 }
  }
}

export const createTodo = async (createTodoDTO: CreateTodoDTO) => {
  const resp = await fetchClient.post<ZResult<Todo>>(`${ApiUrl(`todos`)}`, {
    body: JSON.stringify(createTodoDTO),
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  if (resp.status === 200) {
    return resp.data
  } else {
    return null
  }
}

export const updateTodo = async (
  todoID: number,
  updateTodo: Omit<UpdateTodoDTO, 'order'>
) => {
  const resp = await fetchClient.patch<ZResult<Todo>>(
    `${ApiUrl(`todos/${todoID}`)}`,
    {
      body: JSON.stringify(updateTodo),
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  )
  if (resp.status === 200) {
    return resp.data
  } else {
    return null
  }
}

export const deleteTodo = async (todoID: number) => {
  const resp = await fetchClient.delete<ZResult<Todo>>(
    `${ApiUrl(`todos/${todoID}`)}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  )
  if (resp.status === 200) {
    return resp.data
  } else {
    return null
  }
}

export const exchangeTodoOrder = async (firstTodo: Todo, secondTodo: Todo) => {
  const resp = await Promise.all([
    await fetchClient.patch<ZResult<Todo>>(
      `${ApiUrl(`todos/${firstTodo.id}`)}`,
      {
        body: JSON.stringify({
          order: secondTodo.order
        }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    ),

    await fetchClient.patch<ZResult<Todo>>(
      `${ApiUrl(`todos/${secondTodo.id}`)}`,
      {
        body: JSON.stringify({
          order: firstTodo.order
        }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
  ])
  if (resp.map((r) => r.status).every((status) => status === 200)) {
    return true
  } else {
    return false
  }
}

export default {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  exchangeTodoOrder
}
