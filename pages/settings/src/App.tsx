import { RouterProvider } from 'react-router-dom'
import { JotaiProvider } from './providers/jotai-provider'
import { router } from './routes/router'

const App = () => {
  return (
    <div>
      <JotaiProvider>
        <RouterProvider router={router} />
      </JotaiProvider>
    </div>
  )
}

export default App
