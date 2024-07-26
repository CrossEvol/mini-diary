import { red } from '@mui/material/colors'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import * as React from 'react'

export const ColorModeContext = React.createContext({
    toggleColorMode: () => {},
})

export default function ColorModeProvider({
    children,
}: React.PropsWithChildren) {
    const [mode, setMode] = React.useState<'light' | 'dark'>('light')
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
            },
        }),
        [],
    )

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: '#415edd',
                    },
                    secondary: {
                        main: '#19857b',
                    },
                    error: {
                        main: red.A400,
                    },
                },
            }),
        [mode],
    )

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </ColorModeContext.Provider>
    )
}
