import { app } from 'electron'
import isDev from 'electron-is-dev'
import fs from 'fs'
import path, { join } from 'path'

export const initPrisma = () => {
    const dbPath = isDev
        ? join(__dirname, './prisma/dev.db')
        : path.join(app.getPath('userData'), 'database.db')

    if (!isDev) {
        try {
            // database file does not exist, need to create
            fs.copyFileSync(
                join(process.resourcesPath, 'prisma/dev.db'),
                dbPath,
                fs.constants.COPYFILE_EXCL
            )
            console.log('New database file created')
        } catch (err: any) {
            if (err.code != 'EEXIST') {
                console.error(`Failed creating sqlite file.`, err)
            } else {
                console.log('Database file detected')
            }
        }
    }

    console.log(`Is Production?: ${!isDev}`)
}

export const buildPrismaClient = () => {
    const dbPath = isDev
        ? join(__dirname, './prisma/dev.db')
        : path.join(app.getPath('userData'), 'database.db')

    return null
}
