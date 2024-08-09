import {
    DragHandleMenuProps,
    useBlockNoteEditor,
    useComponentsContext,
} from '@blocknote/react'

export function ResetBlockTypeItem(props: DragHandleMenuProps) {
    const editor = useBlockNoteEditor()

    const Components = useComponentsContext()!

    return (
        <Components.Generic.Menu.Item
            onClick={() => {
                editor.forEachBlock((block) => {
                    editor.removeBlocks([{ id: block.id }])
                    return true
                })
            }}
        >
            Reset
        </Components.Generic.Menu.Item>
    )
}
