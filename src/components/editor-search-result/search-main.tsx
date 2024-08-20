import SearchFab from '@/components/editor-search-result/search-fab'
import SearchResult from '@/components/editor-search-result/search-result'
import queryString from 'query-string'
import React from 'react'
import { useLocation } from 'react-router-dom'
import Loading from './loading'

const SearchMain = () => {
  const location = useLocation()
  const { q } = queryString.parse(location.search) as Record<string, string>

  React.useEffect(() => {
    console.log(queryString.parse(location.search))
    return () => {}
  }, [location.search])

  if (!q) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-start overflow-hidden">
        <h1>Loading...</h1>
        <Loading />
        <SearchFab />
      </div>
    )
  }

  return (
    <div className="h-[92vh] w-screen">
      <SearchFab />
      <SearchResult q={q} />
    </div>
  )
}

export default SearchMain
