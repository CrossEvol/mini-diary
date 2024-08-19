import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { FiSettings } from 'react-icons/fi'
import { GrDocumentStore, GrKey } from 'react-icons/gr'
import { HiOutlineKey } from 'react-icons/hi'
import { IoImagesSharp } from 'react-icons/io5'
import { VscOutput } from 'react-icons/vsc'
import { Button } from '../ui/button'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const config = {
  ui: {
    theme: 'system',
    'main-window': {
      width: 1000,
      height: 800,
      resizable: true,
      'hide-menu': false
    },
    'sub-window': {
      width: 1000,
      height: 800,
      resizable: false,
      'hide-menu': true
    }
  },
  storage: {
    log: {
      dir: 'logs'
    },
    secret: {
      'pri-key': 'private.key',
      'pub-key': 'public.pem'
    },
    database: 'sqlite.db',
    images: '/static'
  },
  system: {
    'auto-update': false,
    notification: true
  },
  server: {
    fixed: false,
    port: 4444
  }
}

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
