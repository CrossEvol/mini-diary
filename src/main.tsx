import {
    CssBaseline,
    StyledEngineProvider,
    ThemeProvider
} from '@mui/material'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import ColorModeProvider from './providers/color-mode-provider'
import { JotaiProvider } from './providers/jotai-provider'
import { createRootTheme } from './theme'

const isDevelopment = process.env.NODE_ENV === 'development'

if (!isDevelopment) {
    localStorage.removeItem('port')
}

const rootElement = document.getElementById('root')!
const root = ReactDOM.createRoot(rootElement)

const rootTheme = createRootTheme(rootElement)

root.render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={rootTheme}>
                <ColorModeProvider>
                    <JotaiProvider>
                        <CssBaseline />
                        <App />
                    </JotaiProvider>
                </ColorModeProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    </React.StrictMode>
)
