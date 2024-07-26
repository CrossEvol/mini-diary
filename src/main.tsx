import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import ColorModeProvider from './providers/color-mode-provider'
import { JotaiProvider } from './providers/jotai-provider'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ColorModeProvider>
            <JotaiProvider>
                <App />
            </JotaiProvider>
        </ColorModeProvider>
    </React.StrictMode>,
)
