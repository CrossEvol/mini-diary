import { portAtom } from '@/atoms/message-port.atom'
import { EChannel } from '@/shared/enums'
import { SendMessagePortData } from '@/shared/params'
import { useAtom } from 'jotai'
import React from 'react'

const IPCLayout = () => {
    const [, setPort] = useAtom(portAtom)

    React.useEffect(() => {
        window.onmessage = (event: MessageEvent<SendMessagePortData>) => {
            // event.source === window means the message is coming from the preload
            // script, as opposed to from an <iframe> or other source.
            if (
                event.source === window &&
                event.data.channel === EChannel.SEND_MESSAGE_PORT
            ) {
                const [port] = event.ports
                setPort(port)
            }
        }
        return () => {}
    }, [])

    return <div className='hidden'>IPCLayout</div>
}

export default IPCLayout
