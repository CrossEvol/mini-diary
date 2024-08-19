
import { Config } from 'ce-shard'
import SettingsForm from './settings-form'
import SettingsHeader from './settings-header'

const defaultConfig = {
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
      'pub-pem': 'public.pem'
    },
    database: 'sqlite.db',
    images: '/static'
  },
  system: {
    'auto-update': false,
    'enable-notify': true
  },
  server: {
    fixed: false,
    port: 4444
  }
} satisfies Config

interface IProps {
  config?: Config
}

function Settings({ config = defaultConfig }: IProps) {
  return (
    <div className="w-full">
      <SettingsHeader />
      <SettingsForm config={config} />
    </div>
  )
}

export default Settings
