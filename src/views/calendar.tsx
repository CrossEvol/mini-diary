import { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

function CalendarView() {
    const [value, onChange] = useState<Value>(new Date())

    return (
        <div className='h-96 w-screen flex justify-center items-center'>
            <Calendar onChange={onChange} value={value} locale='en' />
        </div>
    )
}

export default CalendarView
