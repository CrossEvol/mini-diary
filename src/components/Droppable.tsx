import { useDroppable } from '@dnd-kit/core'
import { PropsWithChildren } from 'react'

export function Droppable(props: { id: string } & PropsWithChildren) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id
  })
  const style = {
    color: isOver ? 'white' : undefined,
    backgroundColor: isOver ? 'red' : undefined
  }

  return (
    <div ref={setNodeRef} style={style} className="w-1/6 m-2">
      {props.children}
    </div>
  )
}
