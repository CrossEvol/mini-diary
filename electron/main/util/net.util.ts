import { serve } from '@hono/node-server'
import * as net from 'net'
import app from '../server/hono.app'

const getRandomPort = (start: number, end: number): number => {
    return Math.floor(Math.random() * (end - start + 1)) + start
}

const isPortAvailable = async (port: number): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        const server = net
            .createServer()
            .listen(port, '127.0.0.1', () => {
                server.close(() => resolve(true))
            })
            .on('error', (err) => {
                if ((err as any).code === 'EADDRINUSE') {
                    resolve(false)
                } else {
                    reject(err)
                }
            })
    })
}

export const findFreePort = async (
    start: number,
    end: number
): Promise<number> => {
    let port = getRandomPort(start, end)
    while (!(await isPortAvailable(port))) {
        port = getRandomPort(start, end)
    }
    return port
}

export const startHonoServer = async () => {
    const port = await findFreePort(3000, 8000)

    console.log(`Server is running on port ${port}`)

    serve({
        fetch: app.fetch,
        port,
    })

    return port
}
