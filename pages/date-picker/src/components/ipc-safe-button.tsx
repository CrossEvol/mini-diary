import { NavigateData } from '@/views/home-view'
import React, { lazy, Suspense } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'

const isDevelopment = process.env.NODE_ENV === 'development'

const IpcButton = lazy(() => import('./ipc-button')) // Your component

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: NavigateData
}

/*
want to dynamic import electron .
but in fact, ipcRenderer can not be used in sub window when context is isolated.
*/
function IpcSafeButton({ className, data }: IProps) {
  return (
    <Suspense fallback={<BeatLoader />}>
      {isDevelopment ? (
        <React.Fragment>
          <Button
            className={className}
            onClick={() => {
              toast({
                description: 'This button send nothing.'
              })
            }}
          >
            Send
          </Button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <IpcButton data={data} />
        </React.Fragment>
      )}
    </Suspense>
  )
}

export default IpcSafeButton
