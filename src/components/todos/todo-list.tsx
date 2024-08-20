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
  totalCount: number
}

export default function TodoList({ todos, totalCount }: IProps) {
  const [q] = useAtom(searchTextAtom)
  const [expanded, setExpanded] = React.useState<number | false>(1)

  const handleExpandedChange =
    (panel: number) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  return (
    <div className="space-y-2">
      <TodoCreateOrSearchInput />
      <Divider />
      {q ? <TodoPagination totalCount={totalCount} /> : null}
      <div className="scrollbar-thumb-rounded max-h-screen overflow-y-scroll scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-200">
        {todos
          .sort((a, b) => b.order - a.order)
          .map((todo) => ({
            ...todo,
            highlights:
              !!q && q?.length > 0
                ? todo.text
                    .replaceAll(
                      q,
                      `%%%<div class="text-white bg-yellow-400 mx-0.5 px-0.5">${q}</div>%%%`
                    )
                    .split('%%%')
                : []
          }))
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
