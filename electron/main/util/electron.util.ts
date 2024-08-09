import dotenv from 'dotenv'
dotenv.config()

export const isDev = () => {
    const isEnvSet = 'ELECTRON_IS_DEV' in process.env
    const getFromEnv = process.env.ELECTRON_IS_DEV?.toLowerCase() === 'true'

    return isEnvSet ? getFromEnv : false
}
