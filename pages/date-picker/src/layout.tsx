import { useAtom } from 'jotai'
import React from 'react'
import { Outlet } from 'react-router-dom'
import ContextMenuWrapper from './components/context-menu-warpper'
import { EChannel } from './shared/enums'
import { SendMessagePortData } from './shared/params'
import { portAtom } from './atoms/port.atom'
import { formatAtom } from './atoms/format.atom'

const Layout = () => {
  const [, setPort] = useAtom(portAtom)
  const [, setFormat] = useAtom(formatAtom)

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
      }
    }
    return () => {}
  }, [setPort, setFormat])

  return (
    <div>
      <ContextMenuWrapper>
        <Outlet />
      </ContextMenuWrapper>
    </div>
  )
}

export default Layout
