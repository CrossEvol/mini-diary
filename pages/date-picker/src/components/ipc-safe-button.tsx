import { toBeImportedAtom } from '@/atoms/to-be-imported'
import { NavigateData } from '@/views/home-view'
import { useAtom } from 'jotai'
import React, { Suspense } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import { ConfirmDialog } from './confirm-dialog'
import IpcButton from './ipc-button'
import { Button } from './ui/button'
import { toast } from './ui/use-toast'

const isDevelopment = process.env.NODE_ENV === 'development'

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: NavigateData
}

/*
want to dynamic import electron .
but in fact, ipcRenderer can not be used in sub window when context is isolated.
*/
function IpcSafeButton({ className, data }: IProps) {
  const [toBeImported] = useAtom(toBeImportedAtom)

  return (
    <Suspense fallback={<BeatLoader />}>
      {isDevelopment ? (
        <React.Fragment>
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
            triggerButton={<Button className={className}>Send</Button>}
            onClose={() => {
              toast({
                description: 'This button send nothing.'
              })
            }}
            confirmText={toBeImported ? 'IMPORT' : 'EXPORT'}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <IpcButton data={data} className={className} />
        </React.Fragment>
      )}
    </Suspense>
  )
}

export default IpcSafeButton
