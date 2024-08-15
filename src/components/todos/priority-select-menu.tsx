import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import { IconButton, Stack, Typography } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { Todo } from 'electron/main/server/api.type'
import * as React from 'react'

interface IProps {
    priority: Todo['priority']
    onMenuItemClick: (priority: Todo['priority']) => void
}

export default function PrioritySelectMenu({
    priority,
    onMenuItemClick,
}: IProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }

    const handleClose = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation()
        setAnchorEl(null)
    }

    const priority2color = (priority: Todo['priority']) => {
        switch (priority) {
            case 'HIGH':
                return 'primary'
            case 'MEDIUM':
                return 'error'
            case 'LOW':
                return 'success'
        }
    }

    return (
        <div className='inline-block'>
            <Tooltip title='Priority'>
                <IconButton
                    id='basic-button'
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <BookmarkOutlinedIcon color={priority2color(priority)} />
                </IconButton>
            </Tooltip>
            <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem
                    onClick={(e) => {
                        handleClose(e)
                        onMenuItemClick('HIGH')
                    }}
                >
                    <Stack direction={'row'}>
                        <BookmarkOutlinedIcon color='primary' />
                        <Typography>HIGH</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    onClick={(e) => {
                        handleClose(e)
                        onMenuItemClick('MEDIUM')
                    }}
                >
                    <Stack direction={'row'}>
                        <BookmarkOutlinedIcon color='error' />
                        <Typography>MEDIUM</Typography>
                    </Stack>
                </MenuItem>
                <MenuItem
                    onClick={(e) => {
                        handleClose(e)
                        onMenuItemClick('LOW')
                    }}
                >
                    <Stack direction={'row'}>
                        <BookmarkOutlinedIcon color='success' />
                        <Typography>LOW</Typography>
                    </Stack>
                </MenuItem>
            </Menu>
        </div>
    )
}
