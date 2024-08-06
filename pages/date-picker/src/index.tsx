import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import App from './App'
import './index.css'
import { JotaiProvider } from './providers/jotai-provider'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

root.render(
  <JotaiProvider>
    <App />
  </JotaiProvider>
)
