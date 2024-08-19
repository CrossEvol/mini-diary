import path from 'path'
import { isDev } from '../util/electron.util'

export const CONFIG_PATH = isDev()
    ? path.join(process.cwd(), 'config.json')
    : path.join(process.resourcesPath, 'config.json')
