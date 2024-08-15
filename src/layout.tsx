import AbcOutlinedIcon from '@mui/icons-material/AbcOutlined'
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import { Avatar, CssBaseline, Stack, Tooltip, useTheme } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useAtom } from 'jotai'
import * as React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { profileAtom } from './atoms/profile.atom'
import CalendarPopover from './components/layouts/calendar-popover'
import EditorLayout from './components/layouts/editor-layout'
import EventEmitterLayout from './components/layouts/event-emitter-layout'
import IPCLayout from './components/layouts/ipc-layout'
import UserProfileLayout from './components/layouts/user-profile-layout'
import { ColorModeContext } from './providers/color-mode-provider'
import { DateTimeFormatEnum, formatDateTime } from './utils/datetime.utils'
import { ApiUrl } from './utils/string.util'

const Layout = () => {
    const [profile] = useAtom(profileAtom)
    const [open, setOpen] = React.useState(false)
    const navigate = useNavigate()
    const theme = useTheme()
    const colorMode = React.useContext(ColorModeContext)

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen)
    }

    const DrawerList = (
        <Box
            sx={{ width: 250 }}
            role='presentation'
            onClick={toggleDrawer(false)}
        >
            <Stack
                direction={'row'}
                spacing={2}
                alignItems={'center'}
                padding={1}
                marginLeft={1}
            >
                <Avatar
                    src={
                        !!profile?.avatar
                            ? `${ApiUrl()}${profile.avatar}`
                            : `${ApiUrl()}/static/go.jpg`
                    }
                />
                <Typography variant='h5'>
                    {profile?.nickname ?? 'Unknown'}
                </Typography>
            </Stack>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/')}>
                        <ListItemIcon>
                            <HomeOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Home'} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/sign-in')}>
                        <ListItemIcon>
                            <LoginOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'SignIn'} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/sign-up')}>
                        <ListItemIcon>
                            <PersonAddOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'SignUp'} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/profile')}>
                        <ListItemIcon>
                            <AccountBoxOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Profile'} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/todo')}>
                        <ListItemIcon>
                            <FormatListNumberedOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Todo'} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() =>
                            navigate(
                                `/editor/${formatDateTime(new Date(), DateTimeFormatEnum.DATE_FORMAT)}`
                            )
                        }
                    >
                        <ListItemIcon>
                            <AbcOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Editor'} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    )

    return (
        <div
            id='app'
            className='overflow-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-blue-200 scrollbar-corner-blue-200 scrollbar-track-white'
        >
            <CssBaseline />
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position='static'>
                    <Toolbar>
                        <Tooltip title='navigation'>
                            <IconButton
                                size='large'
                                edge='start'
                                color='inherit'
                                aria-label='menu'
                                sx={{ mr: 2 }}
                                onClick={toggleDrawer(true)}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Tooltip>
                        <Typography
                            variant='h6'
                            component='div'
                            sx={{ flexGrow: 1 }}
                        >
                            MUI
                        </Typography>
                        <CalendarPopover />
                        <Tooltip title='mode'>
                            <IconButton
                                sx={{ ml: 1 }}
                                onClick={colorMode.toggleColorMode}
                                color='inherit'
                            >
                                {theme.palette.mode === 'dark' ? (
                                    <Brightness7Icon />
                                ) : (
                                    <Brightness4Icon />
                                )}
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
                <div className='overflow-scroll scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-slate-200 scrollbar-corner-slate-200 scrollbar-track-white'>
                    <Outlet />
                </div>
            </Box>
            <EventEmitterLayout />
            <EditorLayout />
            <IPCLayout />
            <UserProfileLayout />
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
            <ToastContainer />
        </div>
    )
}

export default Layout
