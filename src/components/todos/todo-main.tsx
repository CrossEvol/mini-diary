import todoApi from '@/api/todo-api'
import { pickedDayAtom } from '@/atoms/picked-day.atom'
import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import DndTodoMain from './dnd/dnd-todo'
import TodoListLoading from './todo-list-loading'
import { createTodosQueryKey } from '@/utils/string.util'

const DndTodo = () => {
    const [pickedDay] = useAtom(pickedDayAtom)

    // Queries
    const query = useQuery({
        queryKey: [createTodosQueryKey(pickedDay)],
        queryFn: () =>
            todoApi.getTodos({
                startDay: formatDateTime(
                    pickedDay,
                    DateTimeFormatEnum.DATE_FORMAT
                ),
                endDay: formatDateTime(
                    pickedDay,
                    DateTimeFormatEnum.DATE_FORMAT
                ),
            }),
    })

    if (query.isLoading) {
        return (
            <div className='flex max-w-[96vw] mx-auto'>
                <TodoListLoading />
            </div>
        )
    }

    if (query.error || !query.data) {
        return null
    }

    return (
        <div>
            <DndTodoMain todos={query.data} />
        </div>
    )
}

export default DndTodo
