import React, { createContext, PropsWithChildren } from 'react'

interface SearchFabContextProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export const SearchFabContext = createContext<SearchFabContextProps>({
  open: false,
  setOpen: (_) => {}
})

const SearchFabProvider = ({ children }: PropsWithChildren) => {
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <div
        tabIndex={0}
        onKeyUp={(e) => {
          console.log('keyup')
          if (e.key === 'Enter') {
            setOpen(!open)
          }
        }}
      >
        <SearchFabContext.Provider
          value={{
            open,
            setOpen
          }}
        >
          {children}
        </SearchFabContext.Provider>
      </div>
    </React.Fragment>
  )
}

export default SearchFabProvider
