import { portAtom } from '@/atoms/message-port.atom'
import { toBeImportedAtom } from '@/atoms/to-be-imported.atom'
import { EChannel, SendMessagePortData } from 'ce-shard'
import { useAtom } from 'jotai'
import React from 'react'

const IPCLayout = () => {
  const [, setPort] = useAtom(portAtom)
  const [, setToBeImported] = useAtom(toBeImportedAtom)

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
        setToBeImported(event.data.toBeImported)
      }
    }
    return () => {}
  }, [])

  return <div className="hidden">IPCLayout</div>
}

export default IPCLayout
