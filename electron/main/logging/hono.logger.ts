import isDev from 'electron-is-dev'
import log from 'electron-log/main'
import { join } from 'path'

const honoLogger = log.create({ logId: 'hono-logger' })

log.initialize()
log.transports.file.resolvePathFn = () =>
    join(isDev ? 'logs/hono.log' : join(process.resourcesPath, 'logs/hono.log'))
log.info('HonoLogger from the main process')

export default honoLogger
