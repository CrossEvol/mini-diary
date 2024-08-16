import todoApi from '@/api/todo-api'
import { pickedDayAtom } from '@/atoms/picked-day.atom'
import { createTodosQueryKey } from '@/utils/string.util'
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
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import PanToolSharpIcon from '@mui/icons-material/PanToolSharp'
import { Divider, IconButton } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Todo, UpdateTodoDTO } from 'electron/main/server/api.type'
import { useAtom } from 'jotai'
import React from 'react'
import MyDatePicker from '../deadline-date-picker'
import TodoList from '../todo-list'

interface IProps {
    todos: Todo[]
    totalCount: number
}

const DndTodoMain = ({ todos, totalCount }: IProps) => {
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

    // Swap Order Mutations
    const swapMutation = useMutation<
        boolean,
        Error,
        { firstTodo: Todo; secondTodo: Todo }
    >({
        mutationFn: async ({ firstTodo, secondTodo }) =>
            await todoApi.exchangeTodoOrder(firstTodo, secondTodo),
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({
                queryKey: [createTodosQueryKey(pickedDay)],
            })
        },
    })

    // Mutations
    const mutation = useMutation<
        Todo | null,
        Error,
        { todoID: number; params: Pick<UpdateTodoDTO, 'deadline'> }
    >({
        mutationFn: async ({ todoID, params }) =>
            await todoApi.updateTodo(todoID, params),
        onSuccess: (data) => {
            if (data !== null) {
                // Invalidate and refetch
                queryClient.invalidateQueries({
                    queryKey: [createTodosQueryKey(pickedDay)],
                })
            }
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
                await swapMutation.mutateAsync({
                    firstTodo: todos[oldIndex],
                    secondTodo: todos[newIndex],
                })
                return
            } else if (over?.id.toString().match(/^\d{4}-\d{2}-\d{2}$/)) {
                debugger
                mutation.mutateAsync({
                    todoID: Number(active.id),
                    params: { deadline: over?.id.toString() },
                })
                return
            }
        }
        setIsDragging(false)
        setDraggingItem(null)
    }

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event

        setIsDragging(true)
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
            <div className='flex flex-row max-w-[96vw] mx-auto'>
                <div className=' w-1/2 max-h-screen border-2 border-solid  border-white rounded-lg p-4'>
                    <SortableContext
                        items={todos}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className='flex flex-col items-end'>
                            <TodoList todos={todos} totalCount={totalCount} />
                        </div>
                    </SortableContext>
                </div>
                <Divider orientation='vertical' flexItem />
                <div className='w-1/2 max-h-screen border-2 border-solid border-white rounded-lg p-4 flex flex-wrap justify-start'>
                    <MyDatePicker />
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

export default DndTodoMain
