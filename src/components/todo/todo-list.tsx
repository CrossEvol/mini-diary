import { Divider } from '@mui/material'
import { Todo } from 'electron/main/server/api.type'
import * as React from 'react'
import TodoInput from './todo-input'
import TodoItem from './todo-item'

interface IProps {
    todos: Todo[]
}

export default function TodoList({ todos }: IProps) {
    const [expanded, setExpanded] = React.useState<number | false>(1)

    const handleExpandedChange =
        (panel: number) =>
        (_event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false)
        }

    return (
        <div className='space-y-2'>
            <TodoInput />
            <Divider />
            <div className='overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-slate-200 scrollbar-track-white'>
                {todos
                    .sort((a, b) => b.order - a.order)
                    .map((todo) => (
                        <TodoItem
                            key={todo.id}
                            initialTodo={todo}
                            expanded={expanded}
                            handleExpandedChange={handleExpandedChange}
                        />
                    ))}
            </div>
        </div>
    )
}
