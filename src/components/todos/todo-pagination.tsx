import todoApi from '@/api/todo-api'
import { pageSizeAtom } from '@/atoms/page-params.atom'
import { pickedDayAtom } from '@/atoms/picked-day.atom'
import { searchTextAtom } from '@/atoms/search-text.atom'
import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import { createTodosQueryKey } from '@/utils/string.util'
import TablePagination from '@mui/material/TablePagination'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'
import { Todo, ZPageResult } from 'electron/main/server/api.type'
import { useAtom } from 'jotai'
import * as React from 'react'
import { TodoContext } from './todo-context-provider'

interface IProps {
    totalCount: number
}

export default function TodoPagination({ totalCount }: IProps) {
    const [q] = useAtom(searchTextAtom)
    const todoContext = React.useContext(TodoContext)
    const queryClient = useQueryClient()
    const [pickedDay] = useAtom(pickedDayAtom)
    const [pageSize, setPageSize] = useAtom(pageSizeAtom)
    const [page, setPage] = React.useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(pageSize)

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number
    ) => {
        if (newPage > page) {
            todoContext.fetchNextPage()
        } else if (newPage < page) {
            queryClient.setQueryData<InfiniteData<ZPageResult<Todo>['data']>>(
                [createTodosQueryKey(pickedDay)],
                (data) => ({
                    pages: data?.pages.slice(0, data?.pages.length - 1) ?? [],
                    pageParams:
                        data?.pageParams.slice(
                            0,
                            data?.pageParams.length - 1
                        ) ?? [],
                })
            )
        }

        setPage(newPage)
    }

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const newRowsPerPage = parseInt(event.target.value, 10)
        setPageSize(newRowsPerPage)
        setRowsPerPage(newRowsPerPage)
        setPage(0)
    }

    const handlePageSizeChange = async () => {
        const page = await todoApi.getTodos({
            q,
            current: 1,
            per_page: pageSize,
            startDay: formatDateTime(pickedDay, DateTimeFormatEnum.DATE_FORMAT),
            endDay: formatDateTime(pickedDay, DateTimeFormatEnum.DATE_FORMAT),
        })
        queryClient.setQueryData([createTodosQueryKey(pickedDay)], () => ({
            pages: page,
            pageParams: [1],
        }))
        queryClient.cancelQueries({
            queryKey: [createTodosQueryKey(pickedDay)],
        })
        queryClient.invalidateQueries({
            queryKey: [createTodosQueryKey(pickedDay)],
        })
    }

    React.useEffect(() => {
        handlePageSizeChange()
        return () => {}
    }, [pageSize])

    return (
        <TablePagination
            component='div'
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 15, 20]}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    )
}
