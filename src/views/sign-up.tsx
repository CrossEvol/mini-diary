import useNotify from '@/hooks/useNotify'
import fetchClient from '@/utils/fetch.client'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import FormControlLabel from '@mui/material/FormControlLabel'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { User, ZResult } from 'electron/main/server/zod.type'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'

function Copyright(props: any) {
    return (
        <Typography
            variant='body2'
            color='text.secondary'
            align='center'
            {...props}
        >
            {'Copyright © '}
            <Link color='inherit' href='https://mui.com/'>
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    )
}

const SignUpSuccessToast = () => {
    const navigate = useNavigate()

    return (
        <div>
            <div>{'Sign Up Success!'}</div>
            <div>{'Redirect in 3 seconds...'}</div>
            <Button
                variant='contained'
                color='success'
                onClick={() => navigate('/sign-in')}
            >
                Now!
            </Button>
        </div>
    )
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

export default function SignUp() {
    const { notifySuccess, notifyError } = useNotify()
    const navigate = useNavigate()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const res = await fetchClient.post<ZResult<Omit<User, 'password'>>>(
            `http://localhost:${localStorage.getItem('port')}/auth/sign-up`,
            {
                body: JSON.stringify({
                    nickname: data.get('nickname'),
                    email: data.get('email'),
                    password: data.get('password'),
                    pinCode: data.get('pinCode'),
                }),
            }
        )
        if (res.status === 200) {
            notifySuccess(<SignUpSuccessToast />)
            setTimeout(() => navigate('/sign-in'), 3000)
        } else {
            notifyError('Sign Up Error!')
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component='main' maxWidth='xs'>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component='h1' variant='h5'>
                        Sign up
                    </Typography>
                    <Box
                        component='form'
                        noValidate
                        onSubmit={handleSubmit}
                        sx={{ mt: 3 }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id='nickname'
                                    label='NickName'
                                    name='nickname'
                                    autoComplete='nickname'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id='email'
                                    label='Email Address'
                                    name='email'
                                    autoComplete='email'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name='password'
                                    label='Password'
                                    type='password'
                                    id='password'
                                    autoComplete='new-password'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id='pinCode'
                                    label='PinCode'
                                    name='pinCode'
                                    autoComplete='pinCode'
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            value='allowExtraEmails'
                                            color='primary'
                                        />
                                    }
                                    label='I want to receive inspiration, marketing promotions and updates via email.'
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type='submit'
                            fullWidth
                            variant='contained'
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent='flex-end'>
                            <Grid item>
                                <Link href='#' variant='body2'>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    )
}
