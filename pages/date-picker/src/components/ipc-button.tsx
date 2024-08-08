import { EChannel } from '@/shared/enums'
import { NavigateData } from '@/views/home-view'
import React from 'react'
import { Button } from './ui/button'

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: Omit<NavigateData, 'date'>
}

const IpcButton = ({ data, className }: IProps) => {
  return (
    <Button
      className={className}
      onClick={async () => {
        console.log(`send data to ${EChannel.EDITOR_CONTENT}...`)
        window.postMessage(
          { ...data, channel: EChannel.EDITOR_CONTENT },
          { targetOrigin: '*' }
        )
      }}
    >
      Send
    </Button>
  )
}

export default IpcButton
