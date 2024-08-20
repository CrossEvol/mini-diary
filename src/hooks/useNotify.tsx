import { Bounce, toast, ToastContent } from 'react-toastify'

const useNotify = () => {
  const notify = (hasSucceed: boolean, message: ToastContent<unknown>) => {
    if (typeof message === 'string') {
      message = `🦄 ${message}`
    }
    if (hasSucceed) {
      toast.success(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce
      })
    } else {
      toast.error(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce
      })
    }
  }

  const notifySuccess = (message: ToastContent<unknown>) =>
    notify(true, message)
  const notifyError = (message: ToastContent<unknown>) => notify(false, message)

  return { notifySuccess, notifyError }
}

export default useNotify
