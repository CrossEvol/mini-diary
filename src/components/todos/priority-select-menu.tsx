import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined'
import { IconButton } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { Todo } from 'electron/main/server/api.type'
import * as React from 'react'

interface IProps {
    onMenuItemClick: (priority: Todo['priority']) => void
}

export default function PrioritySelectMenu({ onMenuItemClick }: IProps) {
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
                    <BookmarkOutlinedIcon color='primary' />
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
                    HIGH
                </MenuItem>
                <MenuItem
                    onClick={(e) => {
                        handleClose(e)
                        onMenuItemClick('MEDIUM')
                    }}
                >
                    MEDIUM
                </MenuItem>
                <MenuItem
                    onClick={(e) => {
                        handleClose(e)
                        onMenuItemClick('LOW')
                    }}
                >
                    LOW
                </MenuItem>
            </Menu>
        </div>
    )
}
