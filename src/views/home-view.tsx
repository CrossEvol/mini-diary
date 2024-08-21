import useProfile from '@/hooks/useProfile'
import fetchClient from '@/utils/fetch.client'
import { ApiUrl } from '@/utils/string.util'
import { Button, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import ProTip from '../ProTip'
import { DateTimeFormatEnum, formatDateTime } from 'ce-utils'

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Typography
        className="cursor-pointer underline"
        color="inherit"
        component={'span'}
        onClick={() =>
          window.electronAPI.onOpenExternalURl(
            'https://github.com/CrossEvol/mini-diary'
          )
        }
        // href="https://github.com/CrossEvol/mini-diary"
      >
        Your Website
      </Typography>{' '}
      {new Date().getFullYear()}.
    </Typography>
  )
}

export default function HomeView() {
  const { profile } = useProfile()

  const handleHttpRequest = async () => {
    const res = await fetchClient.get(`${ApiUrl()}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log(res)
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, mx: 4 }}>
        <Stack direction={'column'} spacing={2} sx={{ mb: 2 }}>
          {profile === null ? (
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
              You have not
              <Link
                href="/#/sign-in"
                component="a"
                variant="h4"
                className="ml-4"
              >
                Sign In
              </Link>
            </Typography>
          ) : (
            <Typography
              variant="h3"
              component="h1"
              sx={{ mb: 2 }}
              className="space-x-4"
            >
              <span className="font-medium">Welcome,</span>
              <Typography
                href="/#/profile"
                variant="h3"
                component="a"
                sx={{ mb: 1 }}
                className="rounded-xl bg-blue-500 px-4 text-white no-underline"
              >
                {profile.nickname}
              </Typography>
            </Typography>
          )}
        </Stack>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Application for{' '}
          <Link
            href={`/#/editor/${formatDateTime(new Date(), DateTimeFormatEnum.DATE_FORMAT)}`}
            component="a"
            variant="h4"
            className="ml-1"
          >
            mini-diary
          </Link>{' '}
          and{' '}
          <Link href="/#/todo" component="a" variant="h4" className="ml-1">
            simple todo
          </Link>
        </Typography>
        <Stack direction={'column'} justifyItems={'start'} alignItems={'start'}>
          <Typography variant="body2" component="h1" sx={{ mb: 1 }}>
            You can test whether the hono-backend running or not
          </Typography>
          <Button variant="contained" onClick={handleHttpRequest}>
            Test HttpRequest
          </Button>
        </Stack>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  )
}
