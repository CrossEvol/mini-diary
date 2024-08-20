import { useAtom } from 'jotai'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { formatAtom } from './atoms/format.atom'
import { portAtom } from './atoms/port.atom'
import { toBeImportedAtom } from './atoms/to-be-imported'
import ContextMenuWrapper from './components/context-menu-warpper'
import { EChannel } from 'ce-shard'
import { SendMessagePortData } from 'ce-shard'

const Layout = () => {
  const [, setPort] = useAtom(portAtom)
  const [, setFormat] = useAtom(formatAtom)
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
        setFormat(event.data.format)
        setToBeImported(event.data.toBeImported)
      }
    }
    return () => {}
  }, [setPort, setFormat, setToBeImported])

  return (
    <div>
      <ContextMenuWrapper>
        <Outlet />
      </ContextMenuWrapper>
    </div>
  )
}

export default Layout
