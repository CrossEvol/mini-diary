import { pageSizeAtom } from '@/atoms/page-params.atom'
import { pickedDayAtom } from '@/atoms/picked-day.atom'
import { searchTextAtom } from '@/atoms/search-text.atom'
import { DateTimeFormatEnum, formatDateTime } from 'ce-utils'
import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { Day, DayPicker, DayProps } from 'react-day-picker'
import 'react-day-picker/style.css'
import { Droppable } from './dnd/droppable'

const MyDatePicker = () => {
    const [, setSearchText] = useAtom(searchTextAtom)
    const [, setPageSize] = useAtom(pageSizeAtom)
    const [pickedDay, setPickedDay] = useAtom(pickedDayAtom)
    const [selected, setSelected] = useState<Date>(pickedDay)

    return (
        <DayPicker
            mode='single'
            selected={selected}
            onSelect={(e) => {
                setSelected(e!)
                setPickedDay(e!)
                setSearchText(undefined)
                setPageSize(10)
            }}
            components={{
                Day: (props: DayProps) => {
                    return (
                        <Droppable
                            element={'td'}
                            id={formatDateTime(
                                props.day.date,
                                DateTimeFormatEnum.DATE_FORMAT
                            )}
                        >
                            <Day {...props} />
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

export default React.memo(MyDatePicker)
