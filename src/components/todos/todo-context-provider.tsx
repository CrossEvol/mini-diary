import { createContext } from 'react'

interface TodoContextProps {
    fetchNextPage: () => any
    fetchPreviousPage: () => any
    hasNextPage: boolean
    hasPreviousPage: boolean
    isFetching: boolean
    isFetchingNextPage: boolean
    isFetchingPreviousPage: boolean
}

export const TodoContext = createContext<TodoContextProps>({
    fetchNextPage: function () {
        throw new Error('Function not implemented.')
    },
    fetchPreviousPage: function () {
        throw new Error('Function not implemented.')
    },
    hasNextPage: false,
    hasPreviousPage: false,
    isFetching: false,
    isFetchingNextPage: false,
    isFetchingPreviousPage: false,
})
