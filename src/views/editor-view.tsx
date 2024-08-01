import Editor from '@/components/editor'
import React from 'react'
import { useLocation, useParams } from 'react-router'

const EditorView = () => {
    const location = useLocation()
    const params = useParams()

    React.useEffect(() => {
        console.log(params)
        return () => {}
    }, [location.pathname])

    return (
        <div>
            <Editor />
        </div>
    )
}

export default EditorView
