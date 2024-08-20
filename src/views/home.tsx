import fetchClient from '@/utils/fetch.client'
import { ApiUrl } from '@/utils/string.util'
import { Button, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import ProTip from '../ProTip'

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  )
}

export default function Home() {
  const handleHttpRequest = async () => {
    const res = await fetchClient.get(`${ApiUrl()}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log(res)
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Stack direction={'column'} spacing={2}>
          <Button
            id="toggle-dark-mode"
            variant="outlined"
            className="w-1/2"
            onClick={() => window.electronAPI.toggle()}
          >
            Toggle Dark Mode
          </Button>
          <Button
            id="reset-to-system"
            variant="outlined"
            className="w-1/2"
            onClick={() => window.electronAPI.system()}
          >
            Reset to System Theme
          </Button>
        </Stack>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material UI Vite.js example in TypeScript
        </Typography>
        <Button variant="contained" onClick={handleHttpRequest}>
          Test HttpRequest
        </Button>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  )
}
