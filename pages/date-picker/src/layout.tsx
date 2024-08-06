import { atom, useAtom } from 'jotai'
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { EChannel } from './shared/enums'

export const portAtom = atom<MessagePort | null>(null)

const Layout = () => {
  const [, setPort] = useAtom(portAtom)

  React.useEffect(() => {
    window.onmessage = (event) => {
      // event.source === window means the message is coming from the preload
      // script, as opposed to from an <iframe> or other source.
      if (
        event.source === window &&
        event.data === EChannel.SEND_MESSAGE_PORT
      ) {
        const [port] = event.ports
        setPort(port)
      }
    }
    return () => {}
  }, [])

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Layout
