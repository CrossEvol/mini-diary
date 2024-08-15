import todoApi from '@/api/todo-api'
import { pickedDayAtom } from '@/atoms/picked-day.atom'
import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
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
import { CreateTodoDTO, Todo } from 'electron/main/server/api.type'
import { useAtom } from 'jotai'
import * as React from 'react'

type InputState = 'create' | 'search'

export default function TodoCreateOrSearchInput() {
    const [text, setText] = React.useState('')
    const [pickedDay] = useAtom(pickedDayAtom)
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

    return (
        <Paper
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
                        onClick={() => setInputState('search')}
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
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                value={text}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
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
                placeholder={
                    inputState === 'create'
                        ? 'Write some text ...'
                        : 'Search todo ...'
                }
                inputProps={{ 'aria-label': 'search google maps' }}
            />
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
                    >
                        <SearchIcon />
                    </IconButton>
                </Tooltip>
            )}
        </Paper>
    )
}
