import SearchFabProvider from '@/components/editor-search-result/search-fab-context'
import SearchMain from '@/components/editor-search-result/search-main'
import React from 'react'

const EditorSearchView = () => {
  return (
    <React.Fragment>
      <SearchFabProvider>
        <SearchMain />
      </SearchFabProvider>
    </React.Fragment>
  )
}

export default EditorSearchView
