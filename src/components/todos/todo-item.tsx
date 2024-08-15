import todoApi from '@/api/todo-api'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined'
import NotStartedOutlinedIcon from '@mui/icons-material/NotStartedOutlined'
import PanToolOutlinedIcon from '@mui/icons-material/PanToolOutlined'
import RotateLeftRoundedIcon from '@mui/icons-material/RotateLeftRounded'
import { IconButton } from '@mui/material'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useMutation } from '@tanstack/react-query'
import { Todo, UpdateTodoDTO } from 'electron/main/server/api.type'
import * as React from 'react'
import { SortableItem } from './dnd/sortable-item'
import PrioritySelectMenu from './priority-select-menu'
import TodoEditForm from './todo-edit-form'

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

interface IProps {
    initialTodo: Todo
    expanded: number | false
    handleExpandedChange: (
        panel: number
    ) => (event: React.SyntheticEvent, newExpanded: boolean) => void
}

export default function TodoItem({
    initialTodo,
    expanded,
    handleExpandedChange,
}: IProps) {
    const [todo, setTodo] = React.useState(initialTodo)

    // Mutations
    const mutation = useMutation<
        Todo | null,
        Error,
        Omit<UpdateTodoDTO, 'order'>
    >({
        mutationFn: async (params) => await todoApi.updateTodo(todo.id, params),
        onSuccess: (data) => {
            if (data !== null) {
                setTodo({ ...todo, ...data })
            }
        },
    })

    const handleTodoPriorityChange = (priority: Todo['priority']) => {
        mutation.mutateAsync({ priority })
    }

    return (
        <div>
            <Accordion
                expanded={expanded === todo.id}
                onChange={handleExpandedChange(todo.id)}
            >
                <AccordionSummary
                    aria-controls='panel1d-content'
                    id='panel1d-header'
                >
                    <div className='w-full flex items-center justify-between'>
                        <Typography className='overflow-ellipsis'>
                            {todo.text}
                        </Typography>
                        <div>
                            <SortableItem
                                element={'span'}
                                id={todo.id.toString()}
                            >
                                <Tooltip title='Drag'>
                                    <IconButton color='info'>
                                        <PanToolOutlinedIcon />
                                    </IconButton>
                                </Tooltip>
                            </SortableItem>

                            <PrioritySelectMenu
                                priority={todo.priority}
                                onMenuItemClick={handleTodoPriorityChange}
                            />
                            <Tooltip title='Complete'>
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        mutation.mutateAsync({
                                            status: 'COMPLETED',
                                        })
                                    }}
                                >
                                    <DoneOutlineOutlinedIcon color='success' />
                                </IconButton>
                            </Tooltip>
                            {todo.status === 'PAUSED' ? (
                                <Tooltip title='paused'>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            mutation.mutateAsync({
                                                status: 'PENDING',
                                            })
                                        }}
                                    >
                                        {todo.status === 'PAUSED' ? (
                                            <RotateLeftRoundedIcon color='secondary' />
                                        ) : null}
                                    </IconButton>
                                </Tooltip>
                            ) : null}
                            {todo.status === 'PENDING' ? (
                                <Tooltip title='pending'>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            mutation.mutateAsync({
                                                status: 'PAUSED',
                                            })
                                        }}
                                    >
                                        {todo.status === 'PENDING' ? (
                                            <NotStartedOutlinedIcon color='warning' />
                                        ) : null}
                                    </IconButton>
                                </Tooltip>
                            ) : null}
                            <Tooltip title='Delete'>
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation()
                                    }}
                                >
                                    <CancelOutlinedIcon color='error' />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                </AccordionSummary>
                <AccordionDetails>
                    <TodoEditForm todo={todo} setTodo={setTodo} />
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
