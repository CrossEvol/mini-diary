import { DateTimeFormatEnum, formatDateTime } from '@/utils/datetime.utils'
import React from 'react'

const IPCLayout = () => {
    React.useEffect(() => {
        window.onmessage = (event) => {
            // event.source === window means the message is coming from the preload
            // script, as opposed to from an <iframe> or other source.
            if (event.source === window && event.data === 'main-world-port') {
                const [port] = event.ports

                // We can also receive messages from the main world of the renderer.
                port.onmessage = (event) => {
                    console.log(
                        'from renderer main world:',
                        formatDateTime(
                            event.data,
                            DateTimeFormatEnum.DAY_FORMAT
                        )
                    )
                }
                port.postMessage({
                    id: 1,
                    username: 'emilys',
                    email: 'emily.johnson@x.dummyjson.com',
                    firstName: 'Emily',
                    lastName: 'Johnson',
                    gender: 'female',
                    image: 'https://dummyjson.com/icon/emilys/128',
                })
                port.start()
            }
        }
        return () => {}
    }, [])

    return <div className='hidden'>IPCLayout</div>
}

export default IPCLayout
