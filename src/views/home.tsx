import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import React from 'react'
import ProTip from '../ProTip'
import fetchClient from '@/utils/fetch.client'

function Copyright() {
    return (
        <Typography variant='body2' color='text.secondary' align='center'>
            {'Copyright © '}
            <Link color='inherit' href='https://mui.com/'>
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}.
        </Typography>
    )
}

export default function Home() {
    React.useEffect(() => {
        handleUpdatePort()
    }, [])

    const handleUpdatePort = async () => {
        const { port } = await window.electronAPI.updatePort()
        localStorage.setItem('port', port.toString())
    }

    const handleHttpRequest = async () => {
        const res = await fetchClient.get(
            `http://localhost:${localStorage.getItem('port')}/users`
        )
        console.log(res)
    }

    return (
        <Container maxWidth='sm'>
            <Box sx={{ my: 4 }}>
                <Typography variant='h4' component='h1' sx={{ mb: 2 }}>
                    Material UI Vite.js example in TypeScript
                </Typography>
                <Button variant='contained' onClick={handleHttpRequest}>
                    Test HttpRequest
                </Button>
                <h1 className='text-3xl font-bold underline'>Hello world!</h1>
                <ProTip />
                <Copyright />
            </Box>
        </Container>
    )
}
