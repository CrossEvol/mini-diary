import { Toaster } from '@/components/ui/toaster'
import { RouterProvider } from 'react-router-dom'
import { JotaiProvider } from './providers/jotai-provider'
import { router } from './routes/router'

const App = () => {
  return (
    <div>
      <JotaiProvider>
        <RouterProvider router={router} />
        <Toaster />
      </JotaiProvider>
    </div>
  )
}

export default App
