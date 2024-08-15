import todoApi from '@/api/todo-api'
import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useMutation } from '@tanstack/react-query'
import { Todo, UpdateTodoDTO } from 'electron/main/server/api.type'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

interface FormValues {
    text: string
    remark: string
    deadline: string
}

interface IProps {
    todo: Todo
    setTodo: React.Dispatch<React.SetStateAction<Todo>>
}

const TodoEditForm = ({ todo, setTodo }: IProps) => {
    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            text: todo.text,
            remark: todo.remark,
            deadline: formatDateTime(
                new Date(todo.deadline),
                DateTimeFormatEnum.DATE_FORMAT
            ),
        },
    })

    // Mutations
    const mutation = useMutation<
        Todo | null,
        Error,
        Omit<UpdateTodoDTO, 'order'>
    >({
        mutationFn: async (params) => await todoApi.updateTodo(todo.id, params),
        onSuccess: (data) => {
            if (data !== null) {
                setTodo({ ...todo, ...data, deadline: new Date(data.deadline) })
            }
        },
    })

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data)
        mutation.mutateAsync(data)
    }

    return (
        <Box
            component='form'
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '400px',
            }}
        >
            <Controller
                name='text'
                control={control}
                defaultValue=''
                render={({ field }) => (
                    <TextField
                        {...field}
                        label='Text'
                        variant='outlined'
                        fullWidth
                    />
                )}
            />

            <Controller
                name='remark'
                control={control}
                defaultValue=''
                render={({ field }) => (
                    <TextField
                        {...field}
                        label='Remark'
                        variant='outlined'
                        fullWidth
                        multiline
                        rows={4}
                    />
                )}
            />

            <Controller
                name='deadline'
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label='Deadline'
                        variant='outlined'
                        fullWidth
                        type='date'
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                )}
            />

            <Button type='submit' variant='contained' color='primary'>
                Submit
            </Button>
        </Box>
    )
}

export default TodoEditForm
