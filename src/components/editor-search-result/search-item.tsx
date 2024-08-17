import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import SwitchAccessShortcutSharpIcon from '@mui/icons-material/SwitchAccessShortcutSharp'
import { IconButton, Stack, Tooltip } from '@mui/material'
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import MuiAccordionSummary, {
    AccordionSummaryProps,
} from '@mui/material/AccordionSummary'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import Markdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import remarkGfm from 'remark-gfm'

export type MarkdownEntry = {
    date: string
    mdText: string
}

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
    entry: MarkdownEntry
    expanded: string | false
    handleExpandedChange: (
        panel: string
    ) => (event: React.SyntheticEvent, newExpanded: boolean) => void
}

export default function SearchItem({
    entry,
    expanded,
    handleExpandedChange,
}: IProps) {
    const navigate = useNavigate()

    return (
        <div>
            <Accordion
                expanded={expanded === entry.date}
                onChange={handleExpandedChange(entry.date)}
            >
                <AccordionSummary
                    aria-controls='panel1d-content'
                    id='panel1d-header'
                >
                    <Stack direction={'row'} spacing={4} alignItems={'center'}>
                        <Typography>{entry.date}</Typography>
                        <Tooltip title='Edit'>
                            <IconButton
                                onClick={(e) => {
                                    e.preventDefault()
                                    navigate(`/editor/${entry.date}`)
                                }}
                            >
                                <SwitchAccessShortcutSharpIcon color='primary' />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {expanded === entry.date ? (
                            <Markdown remarkPlugins={[remarkGfm]}>
                                {entry.mdText}
                            </Markdown>
                        ) : (
                            <div className='w-[25rem]'></div>
                        )}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}
