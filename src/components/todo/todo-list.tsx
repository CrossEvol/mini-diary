import todoApi from '@/api/todo-api'
import { pickedDayAtom } from '@/atoms/picked-day.atom'
import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAtom } from 'jotai'
import * as React from 'react'
import TodoItem from './todo-item'
import TodoListLoading from './todo-list-loading'

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

const mockTodo1 = {
    id: 1,
    text: 'Item 1',
    remark: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit.Suspendisse malesuada lacus ex, sit amet blandit leolobortis eget. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Suspendisse malesuada lacus ex, sitamet blandit leo lobortis eget.',
    status: 'PAUSED',
    deadline: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    priority: 'HIGH',
    order: 0,
    createdBy: 1,
}

const mockTodo2 = {
    id: 2,
    text: 'Item 2',
    remark: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit.Suspendisse malesuada lacus ex, sit amet blandit leolobortis eget. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Suspendisse malesuada lacus ex, sitamet blandit leo lobortis eget.',
    status: 'PAUSED',
    deadline: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    priority: 'HIGH',
    order: 0,
    createdBy: 1,
}

const mockTodo3 = {
    id: 3,
    text: 'Item 3',
    remark: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit.Suspendisse malesuada lacus ex, sit amet blandit leolobortis eget. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Suspendisse malesuada lacus ex, sitamet blandit leo lobortis eget.',
    status: 'PAUSED',
    deadline: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    priority: 'HIGH',
    order: 0,
    createdBy: 1,
}

const mockTodoList = [mockTodo1, mockTodo2, mockTodo3]

export type Todo = typeof mockTodo1

export default function TodoList() {
    const [pickedDay] = useAtom(pickedDayAtom)

    // Access the client
    const queryClient = useQueryClient()

    // Queries
    const query = useQuery({
        queryKey: [
            `todos-${formatDateTime(pickedDay, DateTimeFormatEnum.DATE_FORMAT)}`,
        ],
        queryFn: () =>
            todoApi.getTodos({
                startDay: formatDateTime(
                    pickedDay,
                    DateTimeFormatEnum.DATE_FORMAT
                ),
                endDay: formatDateTime(
                    pickedDay,
                    DateTimeFormatEnum.DATE_FORMAT
                ),
            }),
    })
    const [expanded, setExpanded] = React.useState<number | false>(1)

    const handleExpandedChange =
        (panel: number) =>
        (_event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false)
        }

    if (query.isLoading) {
        return <TodoListLoading />
    }

    if (query.error || !query.data) {
        return null
    }

    return (
        <div>
            {query.data.map((todo) => (
                <TodoItem
                    key={todo.id}
                    initialTodo={todo}
                    expanded={expanded}
                    handleExpandedChange={handleExpandedChange}
                />
            ))}
        </div>
    )
}
