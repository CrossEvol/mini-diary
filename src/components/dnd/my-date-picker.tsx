import { useState } from 'react'
import { Day, DayPicker, DayProps } from 'react-day-picker'
import 'react-day-picker/style.css'
import React from 'react'
import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import { Droppable } from './droppable'

function MyDatePicker({ onClick }: any) {
    const [selected, setSelected] = useState<Date>()

    return (
        <DayPicker
            mode='single'
            selected={selected}
            onSelect={(e) => {
                onClick()
                setSelected(e)
            }}
            components={{
                Day: (props: DayProps) => {
                    // React.useEffect(() => {
                    //     console.log(
                    //         formatDateTime(
                    //             props.day.date,
                    //             DateTimeFormatEnum.DATE_FORMAT
                    //         )
                    //     )
                    //     return () => {}
                    // }, [])

                    return (
                        <Droppable
                            id={formatDateTime(
                                props.day.date,
                                DateTimeFormatEnum.DATE_FORMAT
                            )}
                        >
                            <Day {...props} onClick={onClick} />
                        </Droppable>
                    )
                },
            }}
            footer={
                selected
                    ? `Selected: ${selected.toLocaleDateString()}`
                    : 'Pick a day.'
            }
        />
    )
}

export default MyDatePicker
