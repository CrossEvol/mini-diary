import { toBeImportedAtom } from '@/atoms/to-be-imported'
import { EChannel } from '@/shared/enums'
import { NavigateData } from '@/views/home-view'
import { useAtom } from 'jotai'
import React from 'react'
import { ConfirmDialog } from './confirm-dialog'
import { Button } from './ui/button'

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: Omit<NavigateData, 'date'>
}

const IpcButton = ({ data, className }: IProps) => {
  const [toBeImported] = useAtom(toBeImportedAtom)

  return (
    <ConfirmDialog
      description={
        <span>
          Do you want to{' '}
          <span className="font-bold uppercase text-black">
            {toBeImported ? 'import' : 'export'}
          </span>{' '}
          the content?
        </span>
      }
      onClose={async () => {
        console.log(`send data to ${EChannel.EDITOR_CONTENT}...`)
        window.postMessage(
          { ...data, channel: EChannel.EDITOR_CONTENT },
          { targetOrigin: '*' }
        )
      }}
      triggerButton={<Button className={className}>Send</Button>}
    />
  )
}

export default IpcButton
