import todoApi from '@/api/todo-api'
import { pickedDayAtom } from '@/atoms/picked-day.atom'
import { searchTextAtom } from '@/atoms/search-text.atom'
import { createTodosQueryKey } from '@/utils/string.util'
import DirectionsIcon from '@mui/icons-material/Directions'
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined'
import PageviewOutlinedIcon from '@mui/icons-material/PageviewOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { Tooltip } from '@mui/material'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DATE_1999_09_09 } from 'ce-shard'
import { DateTimeFormatEnum, formatDateTime } from 'ce-utils'
import { CreateTodoDTO, Todo } from 'electron/main/server/api.type'
import { useAtom } from 'jotai'
import * as React from 'react'

type InputState = 'create' | 'search'

export default function TodoCreateOrSearchInput() {
    const [, setSearchText] = useAtom(searchTextAtom)
    const [text, setText] = React.useState('')
    const [pickedDay, setPickedDay] = useAtom(pickedDayAtom)
    const queryClient = useQueryClient()
    const [inputState, setInputState] = React.useState<InputState>('create')

    // Mutations
    const mutation = useMutation<Todo | null, Error, CreateTodoDTO>({
        mutationFn: async (params) => await todoApi.createTodo(params),
        onSuccess: (data) => {
            if (data !== null) {
                queryClient.invalidateQueries({
                    queryKey: [createTodosQueryKey(pickedDay)],
                })
            }
        },
    })

    const resetTodosPage = async (pageSize: number) => {
        const page = await todoApi.getTodos({
            q: text,
            current: 1,
            per_page: pageSize,
            startDay: formatDateTime(pickedDay, DateTimeFormatEnum.DATE_FORMAT),
            endDay: formatDateTime(pickedDay, DateTimeFormatEnum.DATE_FORMAT),
        })
        queryClient.setQueryData([createTodosQueryKey(pickedDay)], () => ({
            pages: page,
            pageParams: [0],
        }))
        queryClient.cancelQueries({
            queryKey: [createTodosQueryKey(pickedDay)],
        })
        queryClient.invalidateQueries({
            queryKey: [createTodosQueryKey(pickedDay)],
        })
    }

    return (
        <Paper
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
            }}
            component='form'
            sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
            }}
        >
            {inputState === 'create' ? (
                <Tooltip title='create'>
                    <IconButton
                        sx={{ p: '10px' }}
                        aria-label='menu'
                        onClick={() => {
                            setInputState('search')
                        }}
                    >
                        <LibraryAddOutlinedIcon color='primary' />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title='search'>
                    <IconButton
                        sx={{ p: '10px' }}
                        aria-label='menu'
                        onClick={() => setInputState('create')}
                    >
                        <PageviewOutlinedIcon color='info' />
                    </IconButton>
                </Tooltip>
            )}
            {inputState === 'create' ? (
                <InputBase
                    componentsProps={{
                        input: {
                            type: 'text',
                        },
                    }}
                    sx={{ ml: 1, flex: 1 }}
                    value={text}
                    onKeyUp={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            e.stopPropagation()
                            mutation.mutateAsync(
                                {
                                    text,
                                    deadline: formatDateTime(
                                        pickedDay,
                                        DateTimeFormatEnum.DATE_FORMAT
                                    ),
                                },
                                {
                                    onSettled(data, error, variables, context) {
                                        setText('')
                                    },
                                }
                            )
                        }
                    }}
                    onChange={(e) => {
                        setText(e.target.value)
                    }}
                    placeholder={'Write some text ...'}
                    inputProps={{ 'aria-label': 'search google maps' }}
                />
            ) : (
                <InputBase
                    componentsProps={{
                        input: {
                            type: 'text',
                        },
                    }}
                    sx={{ ml: 1, flex: 1 }}
                    value={text}
                    onKeyUp={async (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault()
                            e.stopPropagation()
                            setPickedDay(DATE_1999_09_09)
                            setSearchText(text)
                            await resetTodosPage(10)
                        }
                    }}
                    onChange={(e) => {
                        setText(e.target.value)
                    }}
                    placeholder={'Search todo ...'}
                    inputProps={{ 'aria-label': 'search google maps' }}
                />
            )}
            <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
            {inputState === 'create' ? (
                <Tooltip title='CREATE'>
                    <IconButton
                        color='primary'
                        sx={{ p: '10px' }}
                        aria-label='directions'
                        onClick={() => {
                            mutation.mutateAsync({
                                text,
                                deadline: formatDateTime(
                                    pickedDay,
                                    DateTimeFormatEnum.DATE_FORMAT
                                ),
                            })
                        }}
                    >
                        <DirectionsIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title='SEARCH'>
                    <IconButton
                        type='button'
                        sx={{ p: '10px' }}
                        aria-label='search'
                        onClick={async () => {
                            setSearchText(text)
                            setPickedDay(DATE_1999_09_09)
                            await resetTodosPage(10)
                        }}
                    >
                        <SearchIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Paper>
    )
}
