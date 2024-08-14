import { useDroppable } from '@dnd-kit/core'
import { PropsWithChildren } from 'react'

export function Droppable(props: { id: string } & PropsWithChildren) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    })
    const style = {
        color: isOver ? 'white' : undefined,
        backgroundColor: isOver ? 'red' : undefined,
    }

    return (
        <td ref={setNodeRef} style={style}>
            {props.children}
        </td>
    )
}
