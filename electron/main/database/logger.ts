import { DefaultLogger, LogWriter } from 'drizzle-orm'
import logger from '../logging/winston.util'

class MyLogWriter implements LogWriter {
    write(message: string) {
        const cyan = '\x1b[36m'
        const reset = '\x1b[0m' // Reset color
        logger.info(`${cyan}${message}${reset}`)
    }
}
const drizzleLogger = new DefaultLogger({ writer: new MyLogWriter() })

export default drizzleLogger
