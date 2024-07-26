import AbcOutlinedIcon from '@mui/icons-material/AbcOutlined'
import AddAlarmOutlinedIcon from '@mui/icons-material/AddAlarmOutlined'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import FormatListNumberedOutlinedIcon from '@mui/icons-material/FormatListNumberedOutlined'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import { CssBaseline, useTheme } from '@mui/material'
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
import * as React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { ColorModeContext } from './providers/color-mode-provider'

const Layout = () => {
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
            onClick={toggleDrawer(false)}>
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
            </List>
        </Box>
    )

    return (
        <div id='app'>
            <CssBaseline />
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position='static'>
                    <Toolbar>
                        <IconButton
                            size='large'
                            edge='start'
                            color='inherit'
                            aria-label='menu'
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant='h6'
                            component='div'
                            sx={{ flexGrow: 1 }}>
                            MUI
                        </Typography>
                        <IconButton
                            sx={{ ml: 1 }}
                            onClick={colorMode.toggleColorMode}
                            color='inherit'>
                            {theme.palette.mode === 'dark' ? (
                                <Brightness7Icon />
                            ) : (
                                <Brightness4Icon />
                            )}
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Outlet />
            </Box>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    )
}

export default Layout
