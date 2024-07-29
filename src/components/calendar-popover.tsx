import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { IconButton } from '@mui/material'
import Popover from '@mui/material/Popover'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

export default function CalendarPopover() {
    const [value, onChange] = useState<Value>(new Date())

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
                        value as Date,
                        DateTimeFormatEnum.DAY_FORMAT
                    )}
                </Typography>
                <IconButton
                    sx={{ ml: 1 }}
                    onClick={handleClick}
                    color='inherit'
                >
                    <CalendarMonthIcon />
                </IconButton>
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
                <Calendar onChange={onChange} value={value} locale='en' />
            </Popover>
        </div>
    )
}
