import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'
import * as React from 'react'
import TodoItem from './todo-item'

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
    deadline: '2024-08-01T00:00:00.000Z',
    createdAt: '2024-08-13T12:07:16.956Z',
    updatedAt: '2024-08-13T12:07:16.956Z',
    priority: 'HIGH',
    order: 0,
    createdBy: 1,
}

const mockTodo2 = {
    id: 2,
    text: 'Item 2',
    remark: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit.Suspendisse malesuada lacus ex, sit amet blandit leolobortis eget. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Suspendisse malesuada lacus ex, sitamet blandit leo lobortis eget.',
    status: 'PAUSED',
    deadline: '2024-08-01T00:00:00.000Z',
    createdAt: '2024-08-13T12:07:16.956Z',
    updatedAt: '2024-08-13T12:07:16.956Z',
    priority: 'HIGH',
    order: 0,
    createdBy: 1,
}

const mockTodo3 = {
    id: 3,
    text: 'Item 3',
    remark: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit.Suspendisse malesuada lacus ex, sit amet blandit leolobortis eget. Lorem ipsum dolor sit amet, consecteturadipiscing elit. Suspendisse malesuada lacus ex, sitamet blandit leo lobortis eget.',
    status: 'PAUSED',
    deadline: '2024-08-01T00:00:00.000Z',
    createdAt: '2024-08-13T12:07:16.956Z',
    updatedAt: '2024-08-13T12:07:16.956Z',
    priority: 'HIGH',
    order: 0,
    createdBy: 1,
}

const mockTodoList = [mockTodo1, mockTodo2, mockTodo3]

export type Todo = typeof mockTodo1

export default function TodoList() {
    const [expanded, setExpanded] = React.useState<number | false>(1)

    const handleExpandedChange =
        (panel: number) =>
        (_event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false)
        }

    return (
        <div>
            {mockTodoList.map((todo) => (
                <TodoItem
                    initialTodo={todo}
                    expanded={expanded}
                    handleExpandedChange={handleExpandedChange}
                />
            ))}
        </div>
    )
}
