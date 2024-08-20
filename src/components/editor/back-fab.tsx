import SwipeLeftAltSharpIcon from '@mui/icons-material/SwipeLeftAltSharp'
import { Tooltip } from '@mui/material'
import Fab from '@mui/material/Fab'
import { useNavigate } from 'react-router'

const BackFab = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Fab
        onClick={() => navigate(-1)}
        color="primary"
        aria-label="back"
        sx={{
          right: '20%',
          top: '20%',
          transform: 'translate(50%, -50%)',
          position: 'absolute'
        }}
      >
        <Tooltip title="back">
          <SwipeLeftAltSharpIcon />
        </Tooltip>
      </Fab>
    </div>
  )
}

export default BackFab
