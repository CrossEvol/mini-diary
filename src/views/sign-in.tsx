import { profileAtom } from '@/atoms/profile.atom'
import useNotify from '@/hooks/useNotify'
import { ApiUrl } from '@/utils/string.util'
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
import { ZResult } from 'electron/main/server/api.type'
import { useAtom } from 'jotai'
import * as React from 'react'
import { useNavigate } from 'react-router'
import { fetchPost } from 'ce-utils'

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const SignInSuccessToast = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div>{'Sign In Success!'}</div>
      <div>{'Redirect in 3 seconds...'}</div>
      <Button variant="contained" color="success" onClick={() => navigate('/')}>
        Now!
      </Button>
    </div>
  )
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

export default function SignIn() {
  const { notifySuccess, notifyError } = useNotify()
  const [, setProfile] = useAtom(profileAtom)
  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const res = await fetchPost<ZResult<{ token: string }>>(
      `${ApiUrl()}/auth/sign-in`,
      {
        body: JSON.stringify({
          email: data.get('email'),
          password: data.get('password')
        })
      }
    )
    console.log(res)
    if (res.status === 200) {
      localStorage.setItem('token', res.data.token)
      setProfile(null)
      notifySuccess(<SignInSuccessToast />)
      setTimeout(() => navigate('/'), 3000)
    } else {
      notifyError('Sign In Error!')
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  )
}
