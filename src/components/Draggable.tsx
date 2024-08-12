import { useDraggable } from '@dnd-kit/core'
import { PropsWithChildren } from 'react'

export function Draggable(
  props: {
    id: string
  } & PropsWithChildren
) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id
  })
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`
      }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  )
}
