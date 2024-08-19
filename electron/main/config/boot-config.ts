import { Config, ConfigSchema } from 'ce-shard'
import fs, { writeFileSync } from 'node:fs'
import logger from '../logging/winston.util'
import { CONFIG_PATH } from './config-path'
import { defaultConfig } from './default-config'

export function writeConfigJson(
    configPath: string,
    data: Record<string, any>
): boolean {
    try {
        writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf-8')
        return true
    } catch (error) {
        logger.error(error)
        return false
    }
}

export function writeSafeConfigJson(jsonString: string): Config {
    try {
        const parsedConfig = JSON.parse(jsonString)
        const validatedConfig = ConfigSchema.parse(parsedConfig) // Validate with zod
        return validatedConfig
    } catch (error) {
        logger.error(`Invalid config file:, ${error}`)
        // In case of error, use the default config and overwrite the invalid config file
        writeConfigJson(CONFIG_PATH, defaultConfig)
        return defaultConfig
    }
}

// Function to initialize config
export function initializeConfig(configPath = CONFIG_PATH): Config {
    if (!fs.existsSync(configPath)) {
        // File doesn't exist, use the default config and write it to config.json
        writeConfigJson(configPath, defaultConfig)
        return defaultConfig
    }

    // File exists, read and parse the config
    const fileContent = fs.readFileSync(configPath, 'utf-8')
    return writeSafeConfigJson(fileContent)
}
