import { red } from '@mui/material/colors'
import { createTheme } from '@mui/material/styles'

// A custom theme for this app
export const paletteTheme = createTheme({
  palette: {
    primary: {
      main: '#415edd'
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    }
  }
})

export const createRootTheme = (rootElement: HTMLElement) => {
  return createTheme({
    components: {
      MuiPopover: {
        defaultProps: {
          container: rootElement
        }
      },
      MuiPopper: {
        defaultProps: {
          container: rootElement
        }
      },
      MuiDialog: {
        defaultProps: {
          container: rootElement
        }
      },
      MuiModal: {
        defaultProps: {
          container: rootElement
        }
      }
    }
  })
}
