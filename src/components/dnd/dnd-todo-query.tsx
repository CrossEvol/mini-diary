import todoApi from '@/api/todo-api'
import { pickedDayAtom } from '@/atoms/picked-day.atom'
import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import TodoListLoading from './dnd-loading'
import DndTodoDemo from './dnd-todo-demo'

const DndTodoQuery = () => {
    const [pickedDay] = useAtom(pickedDayAtom)

    // Queries
    const query = useQuery({
        queryKey: [
            `todos-${formatDateTime(pickedDay, DateTimeFormatEnum.DATE_FORMAT)}`,
        ],
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
            <div className='flex justify-center items-center w-screen h-screen'>
                <TodoListLoading />
            </div>
        )
    }

    if (query.error || !query.data) {
        return null
    }

    return (
        <div>
            <DndTodoDemo todos={query.data} />
        </div>
    )
}

export default DndTodoQuery
