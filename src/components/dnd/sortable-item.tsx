import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PropsWithChildren } from 'react'

interface IProps extends PropsWithChildren {
    id: string
    element?: React.ElementType
}

export function SortableItem(props: IProps) {
    const Element = props.element || 'div'
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: props.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <Element ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {props.children}
        </Element>
    )
}
