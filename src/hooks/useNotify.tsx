import { Bounce, toast } from 'react-toastify'

const useNotify = () => {
    const notify = (hasSucceed: boolean, message: string) => {
        if (hasSucceed) {
            toast.success(`🦄 ${message}`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                transition: Bounce,
            })
        } else {
            toast.error(`🦄 ${message}`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
                transition: Bounce,
            })
        }
    }

    const notifySuccess = (message: string) => notify(true, message)
    const notifyError = (message: string) => notify(false, message)

    return { notifySuccess, notifyError }
}

export default useNotify
