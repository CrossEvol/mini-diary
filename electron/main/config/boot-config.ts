import fs from 'node:fs'
import { CONFIG_PATH } from './config-path'
import { Config, ConfigSchema } from './config-schema'
import { defaultConfig } from './default-config'

// Function to initialize config
export function initializeConfig(): Config {
    if (!fs.existsSync(CONFIG_PATH)) {
        // File doesn't exist, use the default config and write it to config.json
        fs.writeFileSync(
            CONFIG_PATH,
            JSON.stringify(defaultConfig, null, 2),
            'utf-8'
        )
        return defaultConfig
    }

    // File exists, read and parse the config
    const fileContent = fs.readFileSync(CONFIG_PATH, 'utf-8')
    try {
        const parsedConfig = JSON.parse(fileContent)
        const validatedConfig = ConfigSchema.parse(parsedConfig) // Validate with zod
        return validatedConfig
    } catch (error) {
        console.error('Invalid config file:', error)
        // In case of error, use the default config and overwrite the invalid config file
        fs.writeFileSync(
            CONFIG_PATH,
            JSON.stringify(defaultConfig, null, 2),
            'utf-8'
        )
        return defaultConfig
    }
}
