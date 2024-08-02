import React, { useState } from 'react'

const CounterTest = () => {
    const [count, setCount] = useState(0)

    React.useEffect(() => {
        window.electronAPI.onUpdateCounter((value) => {
            const oldValue = count
            const newValue = oldValue + value
            setCount(newValue)
            window.electronAPI.counterValue(newValue)
        })
        return () => {}
    }, [count, setCount])

    return (
        <div className='counter'>
            <span>{count}</span>
        </div>
    )
}

export default CounterTest
