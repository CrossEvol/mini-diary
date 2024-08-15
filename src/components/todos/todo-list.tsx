import { searchTextAtom } from '@/atoms/search-text.atom'
import { Divider } from '@mui/material'
import { Todo } from 'electron/main/server/api.type'
import { useAtom } from 'jotai'
import * as React from 'react'
import TodoCreateOrSearchInput from './todo-create-or-search-input'
import TodoItem from './todo-item'
import TodoPagination from './todo-pagination'

interface IProps {
    todos: Todo[]
}

export default function TodoList({ todos }: IProps) {
    const [q] = useAtom(searchTextAtom)
    const [expanded, setExpanded] = React.useState<number | false>(1)

    const handleExpandedChange =
        (panel: number) =>
        (_event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false)
        }

    return (
        <div className='space-y-2'>
            <TodoCreateOrSearchInput />
            <Divider />
            {!!q ? <TodoPagination /> : null}
            <div className='max-h-screen overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-slate-200 scrollbar-track-white'>
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
