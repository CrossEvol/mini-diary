import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { IconButton, TextField } from '@mui/material'
import Fab from '@mui/material/Fab'
import * as React from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router'
import { SearchFabContext } from './search-fab-context'

const SearchFab = () => {
    const navigate = useNavigate()
    const [text, setText] = React.useState('')
    const searchFabContext = useContext(SearchFabContext)

    return (
        <Fab
            variant='extended'
            className={`w-96 ${searchFabContext.open ? 'visible' : 'hidden'}`}
            color='primary'
            sx={{
                right: '50%',
                top: '50%',
                transform: 'translate(50%, -50%)',
                position: 'absolute',
            }}
        >
            <IconButton
                onClick={() =>
                    navigate(
                        `/editor/search${text.trim().length > 0 ? `?q=${text.trim()}` : ''}`
                    )
                }
            >
                <SearchOutlinedIcon sx={{ mr: 1 }} />
            </IconButton>
            <TextField
                id='outlined-basic'
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyUp={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (e.key === 'Enter') {
                        navigate(
                            `/editor/search${text.trim().length > 0 ? `?q=${text.trim()}` : ''}`
                        )
                    }
                }}
                size='small'
                variant='outlined'
                className='bg-white'
                placeholder={'Search Text ...'}
            />
        </Fab>
    )
}

export default SearchFab
