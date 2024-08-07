import isDev from 'electron-is-dev'
import log from 'electron-log/main'
import { join } from 'path'

const mainLogger = log.create({ logId: 'main-logger' })
mainLogger.initialize()
mainLogger.transports.file.resolvePathFn = () =>
    join(isDev ? 'logs/main.log' : join(process.resourcesPath, 'logs/main.log'))
mainLogger.info('MainLogger from the main process')

export default mainLogger
