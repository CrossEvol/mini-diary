import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Todo } from './todo-list'

interface FormValues {
    text: string
    remark: string
    deadline: string
}

interface IProps {
    todo: Todo
    setTodo: React.Dispatch<React.SetStateAction<Todo>>
}

const TodoForm = ({ todo, setTodo }: IProps) => {
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

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        console.log(data)
        setTodo({ ...todo, ...data, deadline: new Date(data.deadline) })
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

export default TodoForm
