import Editor from '@/components/editor/editor'
import BackFab from '@/components/editor/back-fab'
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
      <BackFab />
      <Editor />
    </div>
  )
}

export default EditorView
