import { FiSettings } from 'react-icons/fi'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

function SettingsHeader() {
  return (
    <Alert>
      <FiSettings />
      <AlertTitle>Settings</AlertTitle>
      <AlertDescription>
        You can configure settings for your app.
      </AlertDescription>
    </Alert>
  )
}

export default SettingsHeader
