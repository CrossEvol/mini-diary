import { Todo } from 'electron/main/server/api.type'
import * as React from 'react'
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
        <div>
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
    )
}
