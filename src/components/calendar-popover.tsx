import { eventEmitterAtom } from '@/atoms/editor.atom'
import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import SyncIcon from '@mui/icons-material/Sync'
import { IconButton, Stack } from '@mui/material'
import Divider from '@mui/material/Divider'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import Popover from '@mui/material/Popover'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useAtom } from 'jotai'
import * as React from 'react'
import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useNavigate } from 'react-router'

import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import PublishIcon from '@mui/icons-material/Publish'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

const CalendarBarMenus = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div>
            <IconButton
                id='basic-button'
                sx={{ p: '10px' }}
                aria-label='menu'
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleClose}>
                    <Stack direction='row' spacing={2} alignItems={'center'}>
                        <PublishIcon />
                        <Typography variant='overline' className='p-0'>
                            Import
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Stack direction='row' spacing={2} alignItems={'center'}>
                        <FileDownloadIcon />
                        <Typography variant='overline' className='p-0'>
                            Export
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Stack direction='row' spacing={2} alignItems={'center'}>
                        <CloudUploadIcon />
                        <Typography variant='overline' className='p-0'>
                            Imports
                        </Typography>
                    </Stack>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Stack direction='row' spacing={2} alignItems={'center'}>
                        <CloudDownloadIcon />
                        <Typography variant='overline' className='p-0'>
                            Exports
                        </Typography>
                    </Stack>
                </MenuItem>
            </Menu>
        </div>
    )
}

const CalendarBar = () => {
    const [eventEmitter] = useAtom(eventEmitterAtom)

    return (
        <Paper
            component='form'
            sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <CalendarBarMenus />
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder='Search Diary ...'
                inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton type='button' sx={{ p: '10px' }} aria-label='search'>
                <SearchIcon />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation='vertical' />
            <Tooltip title='Sync'>
                <IconButton
                    color='primary'
                    sx={{ p: '10px' }}
                    aria-label='directions'
                    onClick={() => eventEmitter.emit('a')}
                >
                    <SyncIcon />
                </IconButton>
            </Tooltip>
        </Paper>
    )
}

export default function CalendarPopover() {
    const navigate = useNavigate()
    const [chosenDate, setChosenDate] = useState<Value>(new Date())

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    )

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const open = Boolean(anchorEl)
    const id = open ? 'simple-popover' : undefined

    return (
        <div>
            <div className='flex justify-center items-center'>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                    {formatDateTime(
                        chosenDate as Date,
                        DateTimeFormatEnum.DAY_FORMAT
                    )}
                </Typography>
                <Tooltip title='date-picker'>
                    <IconButton
                        sx={{ ml: 1 }}
                        onClick={handleClick}
                        color='inherit'
                    >
                        <CalendarMonthIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <CalendarBar />
                <Calendar
                    onClickDay={(value) => {
                        navigate(
                            `/editor/${formatDateTime(value, DateTimeFormatEnum.DATE_FORMAT)}`,
                            { relative: 'path' }
                        )
                    }}
                    onChange={setChosenDate}
                    value={chosenDate}
                    locale='en'
                />
            </Popover>
        </div>
    )
}
