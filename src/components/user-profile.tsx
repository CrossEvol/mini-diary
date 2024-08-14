import { profileAtom } from '@/atoms/profile.atom'
import useNotify from '@/hooks/useNotify'
import fetchClient from '@/utils/fetch.client'
import { ApiUrl } from '@/utils/string.util'
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    FormControl,
    InputLabel,
    OutlinedInput,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material'
import { User, ZResult } from 'electron/main/server/api.type'
import { useAtom } from 'jotai'
import React, { useState } from 'react'
import UploadZone from './upload-zone'

interface UserProfileProps {
    user: User
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const [value, setValue] = useState(0)
    const [editUser, setEditUser] = useState({
        email: user.email,
        nickname: user.nickname,
        pinCode: user.pinCode,
        password: user.password,
        avatar: user.avatar,
    })
    const { notifySuccess, notifyError } = useNotify()
    const [, setProfile] = useAtom(profileAtom)

    const updateUser = async (updatedUser: Omit<User, 'id'>) => {
        console.log('Updated User:', updatedUser)
        const { email, nickname, pinCode, password, avatar } = updatedUser
        const res = await fetchClient.put<ZResult<User>>(
            `${ApiUrl()}/users/${user.id}`,
            {
                body: JSON.stringify({
                    email,
                    nickname,
                    pinCode,
                    password,
                    avatar: avatar?.replace(`${ApiUrl}/`, ''),
                }),
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
        if (res.status === 200) {
            setProfile(res.data)
            notifySuccess('Update Profile Success!')
        } else {
            notifyError('Update Profile Error!')
        }
    }

    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: number
    ) => {
        setValue(newValue)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEditUser({ ...editUser, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateUser(editUser)
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
                        image={
                            !!user.avatar
                                ? `${ApiUrl()}/${user.avatar}`
                                : `${ApiUrl()}/static/go.jpg`
                        }
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
                    <FormControl fullWidth margin='normal' variant='outlined'>
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
                    <FormControl fullWidth margin='normal' variant='outlined'>
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
                    <FormControl fullWidth margin='normal' variant='outlined'>
                        <TextField
                            id='password'
                            name='password'
                            label='Password'
                            variant='outlined'
                            value={editUser.password}
                            onChange={handleInputChange}
                            // required
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal' variant='outlined'>
                        <TextField
                            id='pinCode'
                            name='pinCode'
                            label='PinCode'
                            variant='outlined'
                            value={editUser.pinCode}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth margin='normal' variant='outlined'>
                        <InputLabel htmlFor='upload-zone-avatar'>
                            Avatar
                        </InputLabel>
                        <OutlinedInput
                            id='upload-zone-avatar'
                            name='avatar'
                            label='Avatar'
                            value={
                                editUser.avatar?.startsWith('static')
                                    ? `${ApiUrl()}/${editUser.avatar}`
                                    : editUser.avatar
                            }
                            required
                            endAdornment={
                                <UploadZone
                                    onSuccess={(resp) => {
                                        setEditUser({
                                            ...editUser,
                                            avatar: resp.avatar_url,
                                        })
                                        notifySuccess('Upload Success!')
                                    }}
                                    onFailure={(_error) =>
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
