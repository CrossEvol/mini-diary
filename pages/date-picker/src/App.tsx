import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import { Toaster } from '@/components/ui/toaster'

const App = () => {
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  )
}

export default App
