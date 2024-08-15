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
import React from 'react'
import TodoList from '../todo/todo-list'
import MyDatePicker from './my-date-picker'

const initialBlocks = Array.from({ length: 30 }).map((_, idx) => ({
    id: idx,
    name: `item ${idx}`,
    data: Array.from({ length: 10 }).map((_, todoIdx) => ({
        id: `${idx}-${todoIdx}`,
        name: `Todo ${idx}-${todoIdx}`,
    })),
}))

const DndTodoDemo = () => {
    const [isDragging, setIsDragging] = React.useState(false)
    const [blocks, setBlocks] = React.useState(initialBlocks)
    const [todos, setTodos] = React.useState(initialBlocks[0].data)
    const [draggingItem, setDraggingItem] = React.useState<
        (typeof initialBlocks)[number]['data'][number] | null
    >(null)
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over!.id) {
            if (over?.id.toString().match(/\d{4}-\d{2}-\d{2}/)) {
                setTodos(todos.filter((todo) => todo.id !== active.id))
                return
            }

            setTodos(() => {
                const oldIndex = todos
                    .map((t) => t.id)
                    .indexOf(active.id.toString())
                const newIndex = todos
                    .map((t) => t.id)
                    .indexOf(over!.id.toString())

                return arrayMove(todos, oldIndex, newIndex)
            })
        }
        setIsDragging(false)
        setDraggingItem(null)

        // const { id: todoID } = event.active
        // const { id: blockID } = event.over!
        // const activatedTodo = todos.find((todo) => todo.id === todoID)!
        // const targetBlock = blocks.filter(
        //     (block) => block.id === Number(blockID)
        // )[0]
        // setBlocks(
        //     blocks
        //         .map((block) =>
        //             block.data.map((e) => e.id).includes(todoID.toString())
        //                 ? {
        //                       ...block,
        //                       data: block.data.filter(
        //                           (todo) => todo.id !== activatedTodo.id
        //                       ),
        //                   }
        //                 : block
        //         )
        //         .map((block) =>
        //             block.id === targetBlock.id
        //                 ? {
        //                       ...block,
        //                       data: [...block.data, activatedTodo!],
        //                   }
        //                 : block
        //         )
        // )
        // setTodos(todos.filter((todo) => todo.id !== todoID))
    }

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        console.log(event)

        setTimeout(() => setIsDragging(true), 1)
        setDraggingItem(
            todos.filter((todo) => todo.id === active.id.toString())[0]
        )
        console.log(event)
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
                            <TodoList />
                            {/* {todos.map((todo) => (
                                <SortableItem key={todo.id} id={todo.id}>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            console.log(todo.name)
                                        }}
                                        className='m-2 border-2 border-solid border-blue-400 rounded-sm h-8 w-24'
                                    >
                                        {todo.name}
                                    </div>
                                </SortableItem>
                            ))} */}
                        </div>
                    </SortableContext>
                    {/* {todos.map((todo) => (
                        <div key={todo.id} className='w-full flex justify-end'>
                            <Draggable id={todo.id}>
                                <div className='m-2 border-2 border-solid border-blue-400 rounded-sm h-8 w-24'>
                                    {todo.name}
                                </div>
                            </Draggable>
                        </div>
                    ))} */}
                </div>
                <div className='w-1/2 h-screen border-2 border-solid border-red-500 rounded-lg p-4 flex flex-wrap justify-start'>
                    {/* {blocks.map((block) => (
                        <Droppable key={block.id} id={block.id.toString()}>
                            <div
                                className='border-2 border-solid border-red-400 rounded-xl h-20 w-full text-center hover:cursor-pointer'
                                onClick={() => setTodos(block.data)}
                            >
                                {block.name}
                            </div>
                        </Droppable>
                    ))} */}
                    <MyDatePicker
                        onClick={() => {
                            // setTodos(
                            //     blocks[Math.floor(Math.random() * 30)].data
                            // )
                        }}
                    />
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
