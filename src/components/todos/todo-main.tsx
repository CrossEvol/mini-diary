import todoApi from '@/api/todo-api'
import { pageSizeAtom } from '@/atoms/page-params.atom'
import { pickedDayAtom } from '@/atoms/picked-day.atom'
import { searchTextAtom } from '@/atoms/search-text.atom'
import { createTodosQueryKey } from '@/utils/string.util'
import { useInfiniteQuery } from '@tanstack/react-query'
import { DateTimeFormatEnum, formatDateTime } from 'ce-utils'
import { useAtom } from 'jotai'
import DndTodoMain from './dnd/dnd-todo'
import { TodoContext } from './todo-context-provider'
import TodoListLoading from './todo-list-loading'

type PageParam = {
    pageParam: number
}

const DndTodo = () => {
    const [pickedDay] = useAtom(pickedDayAtom)
    const [pageSize] = useAtom(pageSizeAtom)
    const [q] = useAtom(searchTextAtom)

    // Queries
    const {
        isLoading,
        error,
        data,
        fetchNextPage,
        fetchPreviousPage,
        hasNextPage,
        hasPreviousPage,
        isFetching,
        isFetchingNextPage,
        isFetchingPreviousPage,
    } = useInfiniteQuery({
        queryKey: [createTodosQueryKey(pickedDay)],
        queryFn: ({ pageParam }: PageParam) =>
            todoApi.getTodos({
                q,
                current: pageParam + 1,
                per_page: pageSize,
                startDay: formatDateTime(
                    pickedDay,
                    DateTimeFormatEnum.DATE_FORMAT
                ),
                endDay: formatDateTime(
                    pickedDay,
                    DateTimeFormatEnum.DATE_FORMAT
                ),
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) =>
            lastPage.current! * lastPage.per_page! > lastPage.total_count
                ? null
                : lastPage.current,
        getPreviousPageParam: (firstPage, pages, _, allPageParams) =>
            allPageParams.findLast((i) => i),
    })

    if (isLoading) {
        return (
            <div className='flex max-w-[96vw] mx-auto'>
                <TodoListLoading />
            </div>
        )
    }

    if (error || !data) {
        return null
    }

    return (
        <div>
            <TodoContext.Provider
                value={{
                    fetchNextPage,
                    fetchPreviousPage,
                    hasNextPage,
                    hasPreviousPage,
                    isFetching,
                    isFetchingNextPage,
                    isFetchingPreviousPage,
                }}
            >
                <DndTodoMain
                    todos={
                        !!data && data.pages.length > 0
                            ? data.pages.map((page) => page.list)[
                                  data.pages.length - 1
                              ]
                            : []
                    }
                    totalCount={
                        !!data && data.pages.length >= 1
                            ? data.pages[data.pages.length - 1].total_count
                            : 0
                    }
                />
            </TodoContext.Provider>
        </div>
    )
}

export default DndTodo
