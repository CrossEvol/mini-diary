import { NavigateData } from '@/views/home-view';
import React, { lazy, Suspense } from 'react';
import BeatLoader from "react-spinners/BeatLoader";
import { Button } from './ui/button';

const isDevelopment = process.env.NODE_ENV === 'development'

const IpcButton = lazy(() => import('./ipc-button')) // Your component

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: NavigateData
}

function IpcSafeButton({ className, data }: IProps) {
  return (
    <Suspense fallback={<BeatLoader />}>
      {isDevelopment ? (
        <React.Fragment>
          <Button className={className}>Send</Button>
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
