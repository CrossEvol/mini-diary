import { useCallback, useState } from 'react'

const useThrottle = (delay: number = 100) => {
    const [isThrottled, setIsThrottled] = useState(false)

    const throttle = useCallback(() => {
        if (!isThrottled) {
            setIsThrottled(true)
            setTimeout(() => {
                setIsThrottled(false)
            }, delay)
        }
    }, [isThrottled, delay])

    return { isThrottled, throttle }
}

export default useThrottle
