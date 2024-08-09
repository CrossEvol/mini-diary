import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    FormControl,
    Input,
    InputLabel,
    OutlinedInput,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material'
import React, { useState } from 'react'
import UploadZone from './upload-zone'
import useNotify from '@/hooks/useNotify'

interface UserProfileProps {
    user: {
        id: number
        email: string
        nickname: string
        pin_code: string
        password: string
        avatar: string
    }
    onSave: (updatedUser: {
        email: string
        nickname: string
        pin_code: string
        password: string
        avatar: string
    }) => void
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSave }) => {
    const [value, setValue] = useState(0)
    const [editUser, setEditUser] = useState({
        email: user.email,
        nickname: user.nickname,
        pin_code: user.pin_code,
        password: user.password,
        avatar: user.avatar,
    })
    const { notifySuccess, notifyError } = useNotify()

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEditUser({ ...editUser, [name]: value })
    }

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files[0]) {
    //         const reader = new FileReader()
    //         reader.onload = () => {
    //             setEditUser({ ...editUser, avatar: reader.result as string })
    //         }
    //         reader.readAsDataURL(e.target.files[0])
    //     }
    // }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(editUser)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleTabChange}>
                <Tab label='Show Profile' />
                <Tab label='Edit Profile' />
            </Tabs>

            <TabPanel value={value} index={0}>
                <Card sx={{}} className='flex justify-center space-x-4'>
                    <CardMedia
                        sx={{ maxWidth: 345 }}
                        component='img'
                        image={user.avatar}
                        alt={`${user.nickname}'s avatar`}
                    />
                    <CardContent>
                        <Typography gutterBottom variant='h5' component='div'>
                            {user.nickname}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            Email: {user.email}
                        </Typography>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={value} index={1}>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            id='email'
                            name='email'
                            label='Email'
                            variant='outlined'
                            value={editUser.email}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            id='nickname'
                            name='nickname'
                            label='NickName'
                            variant='outlined'
                            value={editUser.nickname}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            id='password'
                            name='password'
                            label='Password'
                            variant='outlined'
                            value={editUser.password}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                        <TextField
                            id='pin_code'
                            name='pin_code'
                            label='PinCode'
                            variant='outlined'
                            value={editUser.pin_code}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal'>
                        <InputLabel htmlFor='upload-zone-avatar'>
                            Avatar
                        </InputLabel>
                        <OutlinedInput
                            id='upload-zone-avatar'
                            name='avatar'
                            label='Avatar'
                            inputProps={{ accept: 'image/*' }}
                            // onChange={handleFileChange}
                            required
                            endAdornment={
                                <UploadZone
                                    onSuccess={(resp) => {
                                        setEditUser({
                                            ...editUser,
                                            avatar: `http://localhost:${localStorage.getItem('port')}/${resp.avatar_url}`,
                                        })
                                        notifySuccess('Upload Success!')
                                    }}
                                    onFailure={(error) =>
                                        notifyError('Upload Failed')
                                    }
                                />
                            }
                        />
                    </FormControl>
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant='contained'
                            color='primary'
                            type='submit'
                        >
                            Save
                        </Button>
                    </Box>
                </form>
            </TabPanel>
        </Box>
    )
}

// TabPanel Component
interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

const TabPanel: React.FC<TabPanelProps> = ({
    children,
    value,
    index,
    ...other
}) => {
    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

export default UserProfile
