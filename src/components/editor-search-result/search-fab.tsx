import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import { TextField } from '@mui/material'
import Fab from '@mui/material/Fab'
import { useContext } from 'react'
import { SearchFabContext } from './search-fab-context'

const SearchFab = () => {
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
            <SearchOutlinedIcon sx={{ mr: 1 }} />
            <TextField
                id='outlined-basic'
                size='small'
                variant='outlined'
                className='bg-white'
            />
        </Fab>
    )
}

export default SearchFab
