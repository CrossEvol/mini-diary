import React from 'react'
import { useCounterStore } from '../store/counter-store'

const Counter = () => {
    const { count, inc } = useCounterStore()
    return (
        <div className='counter'>
            <span>{count}</span>
            <button onClick={inc}>one up</button>
        </div>
    )
}

export default Counter
