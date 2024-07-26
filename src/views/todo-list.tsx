// components/TodoList.tsx
import React, { useState } from 'react'
import { useTodoStore } from '../store/todo-store'

const TodoList: React.FC = () => {
    const [newTodo, setNewTodo] = useState('')
    const { todos, addTodo, deleteTodo, toggleTodo } = useTodoStore()

    const handleAddTodo = () => {
        if (newTodo.trim()) {
            addTodo(newTodo)
            setNewTodo('')
        }
    }

    return (
        <div className='mx-auto mt-10 max-w-md rounded-lg bg-white p-4 shadow-lg'>
            <h1 className='mb-4 text-xl font-bold'>Todo List</h1>
            <div className='mb-4 flex'>
                <input
                    type='text'
                    className='flex-grow rounded-md border border-gray-300 p-2'
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                />
                <button
                    className='ml-2 rounded-md bg-blue-500 p-2 text-white'
                    onClick={handleAddTodo}>
                    Add
                </button>
            </div>
            <ul>
                {todos.map((todo) => (
                    <li
                        key={todo.id}
                        className='mb-2 flex items-center justify-between'>
                        <input
                            type='checkbox'
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                            className='mr-2'
                        />
                        <span
                            className={`flex-grow ${todo.completed ? 'line-through' : ''}`}>
                            {todo.text}
                        </span>
                        {/* <span
                            className={`flex-grow cursor-pointer ${
                                todo.completed ? 'line-through' : ''
                            }`}
                            onClick={() => toggleTodo(todo.id)}
                        >
                            {todo.text}
                        </span> */}
                        <button
                            className='ml-2 rounded-md bg-red-500 p-2 text-white'
                            onClick={() => deleteTodo(todo.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TodoList
