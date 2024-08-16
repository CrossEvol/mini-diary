import { pickedDayAtom } from '@/atoms/picked-day.atom'
import { searchTextAtom } from '@/atoms/search-text.atom'
import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { Day, DayPicker, DayProps } from 'react-day-picker'
import 'react-day-picker/style.css'
import { Droppable } from './dnd/droppable'

function MyDatePicker({ onClick }: any) {
    const [, setSearchText] = useAtom(searchTextAtom)
    const [pickedDay, setPickedDay] = useAtom(pickedDayAtom)
    const [selected, setSelected] = useState<Date>(pickedDay)

    return (
        <DayPicker
            mode='single'
            selected={selected}
            onSelect={(e) => {
                onClick()
                setSelected(e!)
                setPickedDay(e!)
                setSearchText(undefined)
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