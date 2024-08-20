// store/todoStore.ts
import { create } from 'zustand'

interface Todo {
  id: number
  text: string
  completed: boolean
}

interface ITodoStore {
  todos: Todo[]
  addTodo: (text: string) => void
  deleteTodo: (id: number) => void
  toggleTodo: (id: number) => void
}

export const useTodoStore = create<ITodoStore>((set) => ({
  todos: [],
  addTodo: (text: string) =>
    set((state) => ({
      todos: [...state.todos, { id: Date.now(), text, completed: false }]
    })),
  deleteTodo: (id: number) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id)
    })),
  toggleTodo: (id: number) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    }))
}))
