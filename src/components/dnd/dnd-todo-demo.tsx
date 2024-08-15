import todoApi from '@/api/todo-api'
import { pickedDayAtom } from '@/atoms/picked-day.atom'
import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import PanToolSharpIcon from '@mui/icons-material/PanToolSharp'
import { IconButton } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Todo } from 'electron/main/server/api.type'
import { useAtom } from 'jotai'
import React from 'react'
import TodoList from '../todo/todo-list'
import MyDatePicker from './my-date-picker'

interface IProps {
    todos: Todo[]
}

const DndTodoDemo = ({ todos }: IProps) => {
    const queryClient = useQueryClient()
    const [pickedDay] = useAtom(pickedDayAtom)
    const [isDragging, setIsDragging] = React.useState(false)
    const [_draggingItem, setDraggingItem] = React.useState<Todo | null>(null)
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // Mutations
    const mutation = useMutation<
        boolean,
        Error,
        { firstTodo: Todo; secondTodo: Todo }
    >({
        mutationFn: async ({ firstTodo, secondTodo }) =>
            await todoApi.exchangeTodoOrder(firstTodo, secondTodo),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({
                queryKey: [
                    `todos-${formatDateTime(pickedDay, DateTimeFormatEnum.DATE_FORMAT)}`,
                ],
            })
        },
    })

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over!.id) {
            if (
                active.id.toString().match(/^\d+$/) &&
                over?.id.toString().match(/^\d+$/)
            ) {
                const oldIndex = todos.findIndex(
                    (todo) => todo.id.toString() === active.id.toString()
                )
                const newIndex = todos.findIndex(
                    (todo) => todo.id.toString() === over.id.toString()
                )
                const flag = await mutation.mutateAsync({
                    firstTodo: todos[oldIndex],
                    secondTodo: todos[newIndex],
                })
                if (flag) arrayMove(todos, oldIndex, newIndex)
                return
            }

            if (over?.id.toString().match(/\d{4}-\d{2}-\d{2}/)) {
                // setTodos(todos.filter((todo) => todo.id !== active.id))
                return
            }
        }
        setIsDragging(false)
        setDraggingItem(null)
    }

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        console.log(todos.map((todo) => todo.id))

        setTimeout(() => setIsDragging(true), 1)
        setDraggingItem(
            todos[
                todos.findIndex(
                    (todo) => todo.id.toString() === active.id.toString()
                )
            ]
        )
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className='flex flex-row w-[96vw] h-screen'>
                <div className=' w-1/2 h-screen border-2 border-solid  border-blue-500 rounded-lg p-4'>
                    <SortableContext
                        items={todos}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className='flex flex-col items-end'>
                            <TodoList todos={todos} />
                        </div>
                    </SortableContext>
                </div>
                <div className='w-1/2 h-screen border-2 border-solid border-red-500 rounded-lg p-4 flex flex-wrap justify-start'>
                    <MyDatePicker onClick={() => {}} />
                </div>
            </div>
            <DragOverlay>
                {isDragging ? (
                    <div className='shadow-purple-500 bg-purple-600 border-purple-800 w-8 h-8 rounded-2xl flex items-center justify-center'>
                        <IconButton>
                            <PanToolSharpIcon className='text-white' />
                        </IconButton>
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

export default DndTodoDemo
