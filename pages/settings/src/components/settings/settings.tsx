import { Config } from 'ce-shard'
import SettingsForm from './settings-form'
import SettingsHeader from './settings-header'

interface IProps {
  config: Config
}

function Settings({ config }: IProps) {
  return (
    <div className="w-full">
      <SettingsHeader />
      <SettingsForm config={config} />
    </div>
  )
}

export default Settings
