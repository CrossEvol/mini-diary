import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { router } from './routes/router'

const App = () => {
    return (
        <>
            <RouterProvider router={router} /> <ToastContainer />
        </>
    )
}

export default App
