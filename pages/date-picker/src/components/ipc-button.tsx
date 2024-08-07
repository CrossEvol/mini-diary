import { NavigateData } from '@/views/home-view'
import { ipcRenderer } from 'electron'
import React from 'react'
import { Button } from './ui/button'

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: NavigateData
}

const IpcButton = ({ data, className }: IProps) => {
  return (
    <Button
      className={className}
      onClick={async () => {
        console.log(data)
        ipcRenderer.send('')
      }}
    >
      Send
    </Button>
  )
}

export default IpcButton
