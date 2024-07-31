import Editor from '@/components/editor'
import { HomeLoaderData } from '@/routes/loaders/home.loader'
import React from 'react'
import { useLoaderData, useLocation, useParams } from 'react-router'

const EditorView = () => {
    let home = useLoaderData() as HomeLoaderData
    const location = useLocation()
    const params = useParams()

    React.useEffect(() => {
        console.log(home)
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
