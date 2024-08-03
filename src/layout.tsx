import AbcOutlinedIcon from '@mui/icons-material/AbcOutlined'
import AddAlarmOutlinedIcon from '@mui/icons-material/AddAlarmOutlined'
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
import { UserProfile, ZResult } from 'electron/main/server/zod.type'
import { useAtom } from 'jotai'
import * as React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { EmitterEvent, eventEmitterAtom } from './atoms/event.emitter.atom'
import { profileAtom } from './atoms/profile.atom'
import CalendarPopover from './components/calendar-popover'
import useNotify from './hooks/useNotify'
import { ColorModeContext } from './providers/color-mode-provider'
import { DateTimeFormatEnum, formatDateTime } from './utils/datetime.utils'
import fetchClient from './utils/fetch.client'

const EventEmitterLayout = () => {
    const [eventEmitter] = useAtom(eventEmitterAtom)
    const { notifySuccess, notifyError } = useNotify()
    const [profile, setProfile] = useAtom(profileAtom)

    const setupUserProfile = async () => {
        if (!localStorage.getItem('token')) {
            return
        }
        if (!!profile) {
            return
        }
        const res = await fetchClient.get<ZResult<UserProfile>>(
            `http://localhost:${localStorage.getItem('port')}/profile`,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
        if (res.status === 200) {
            setProfile(res.data)
        }
    }

    let flag = true

    React.useEffect(() => {
        if (flag) {
            window.electronAPI.onUpdatePort((value) => {
                localStorage.setItem('port', value.toString())
                setupUserProfile()
            })
            window.electronAPI.onExportDiary((value) => {
                console.log('redirect: ', EmitterEvent.EXPORT_DIARY)
                eventEmitter.emit(EmitterEvent.EXPORT_DIARY, value)
            })
            window.electronAPI.onExportAllDiaries((value) => {
                console.log('redirect: ', EmitterEvent.EXPORT_ALL_DIARY)
                eventEmitter.emit(EmitterEvent.EXPORT_ALL_DIARY, value)
            })

            window.electronAPI.onImportDiary((value) => {
                console.log('redirect: ', EmitterEvent.IMPORT_DIARY)
                eventEmitter.emit(EmitterEvent.IMPORT_DIARY, value)
            })
            window.electronAPI.onImportAllDiaries((value) => {
                console.log('redirect: ', EmitterEvent.IMPORT_ALL_DIARY)
                eventEmitter.emit(EmitterEvent.IMPORT_ALL_DIARY, value)
            })

            window.electronAPI.onNotifySuccess((value) => notifySuccess(value))
            window.electronAPI.onNotifyError((value) => notifyError(value))
        }

        return () => {
            flag = false
        }
    }, [eventEmitter])

    return <div className='hidden'></div>
}

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
                    src={`http://localhost:${localStorage.getItem('port')}/static/go.jpg`}
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
                    <ListItemButton onClick={() => navigate('/todo')}>
                        <ListItemIcon>
                            <FormatListNumberedOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Todo'} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/counter')}>
                        <ListItemIcon>
                            <AddAlarmOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Counter'} />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/len')}>
                        <ListItemIcon>
                            <AbcOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Len'} />
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
        <div id='app'>
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
                <Outlet />
            </Box>
            <EventEmitterLayout />
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    )
}

export default Layout
