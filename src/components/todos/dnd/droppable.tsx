import { useDroppable } from '@dnd-kit/core'
import { PropsWithChildren } from 'react'

export function Droppable(
  props: { id: string; element?: React.ElementType } & PropsWithChildren
) {
  const Element = props.element || 'div'
  const { isOver, setNodeRef } = useDroppable({
    id: props.id
  })
  const style = {
    color: isOver ? 'white' : undefined,
    backgroundColor: isOver ? 'red' : undefined
  }

  return (
    <Element ref={setNodeRef} style={style}>
      {props.children}
    </Element>
  )
}
