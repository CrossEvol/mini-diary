import { Provider } from 'jotai'
import { PropsWithChildren } from 'react'

export const JotaiProvider = ({ children }: PropsWithChildren) => (
    <Provider>{children}</Provider>
)
