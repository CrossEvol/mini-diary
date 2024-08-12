import { DndContext } from '@dnd-kit/core'
import React from 'react'
import { Draggable } from './Draggable'
import { Droppable } from './Droppable'

const initialBlocks = Array.from({ length: 30 }).map((_, idx) => ({
    id: idx,
    name: `item ${idx}`,
    data: Array.from({ length: 10 }).map((_, todoIdx) => ({
        id: `${idx}-${todoIdx}`,
        name: `Todo ${idx}-${todoIdx}`,
    })),
}))

const DndTodoDemo = () => {
    const [blocks, setBlocks] = React.useState(initialBlocks)
    const [todos, setTodos] = React.useState(initialBlocks[0].data)

    return (
        <DndContext
            onDragStart={(e) => console.log(e)}
            onDragEnd={(e) => {
                const { id: todoID } = e.active
                const { id: blockID } = e.over!
                const activatedTodo = todos.find((todo) => todo.id === todoID)!
                const targetBlock = blocks.filter(
                    (block) => block.id === Number(blockID)
                )[0]
                setBlocks(
                    blocks
                        .map((block) =>
                            block.data
                                .map((e) => e.id)
                                .includes(todoID.toString())
                                ? {
                                      ...block,
                                      data: block.data.filter(
                                          (todo) => todo.id !== activatedTodo.id
                                      ),
                                  }
                                : block
                        )
                        .map((block) =>
                            block.id === targetBlock.id
                                ? {
                                      ...block,
                                      data: [...block.data, activatedTodo!],
                                  }
                                : block
                        )
                )
                setTodos(todos.filter((todo) => todo.id !== todoID))
            }}
        >
            <div className='flex flex-row w-[96vw] h-screen'>
                <div className=' w-1/2 h-screen border-2 border-solid  border-blue-500 rounded-lg p-4'>
                    {todos.map((todo) => (
                        <div key={todo.id} className='w-full flex justify-end'>
                            <Draggable id={todo.id}>
                                <div className='m-2 border-2 border-solid border-blue-400 rounded-sm h-8 w-24'>
                                    {todo.name}
                                </div>
                            </Draggable>
                        </div>
                    ))}
                </div>
                <div className='w-1/2 h-screen border-2 border-solid border-red-500 rounded-lg p-4 flex flex-wrap justify-start'>
                    {blocks.map((block) => (
                        <Droppable key={block.id} id={block.id.toString()}>
                            <div
                                className='border-2 border-solid border-red-400 rounded-xl h-20 w-full text-center hover:cursor-pointer'
                                onClick={() => setTodos(block.data)}
                            >
                                {block.name}
                            </div>
                        </Droppable>
                    ))}
                </div>
            </div>
        </DndContext>
    )
}

export default DndTodoDemo
