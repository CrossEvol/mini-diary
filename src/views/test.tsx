import { Button } from '@mui/material'
import React, { useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const TestView = () => {
    const navigate = useNavigate()
    const location = useLocation() // Hook to get the current location object
    const params = useParams()
    const str = useRef(new Date().toString())

    // This will cause the component to re-render whenever the location changes
    React.useEffect(() => {
        // Logic to handle what happens when the location changes
        console.log(location)
        console.log(params)
        console.log('....')
        console.log(str.current)
    }, [location])

    return (
        <div>
            <div>Test</div>
            <Button
                variant='contained'
                onClick={() => navigate(`/test/${getRandomInt(1, 100)}`)}
            >
                NewID
            </Button>
        </div>
    )
}

export default TestView
