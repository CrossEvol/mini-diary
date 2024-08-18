import * as net from 'net'
import { execAsync } from './cmd.aux'

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

interface Connection {
    protocol: string
    localAddress: string
    localPort: number
    remoteAddress: string
    remotePort: number
    state: string
    pid: number
}

export const getConnectionsUsingPort = async (
    port: number
): Promise<Connection[]> => {
    try {
        const { stdout } = await execAsync(`netstat -ano | findstr ${port}`)

        const lines = stdout.trim().split('\n')
        const connections: Connection[] = lines.map((line) => {
            const parts = line.trim().split(/\s+/)

            const [protocol, localAddressPort, remoteAddressPort, state, pid] =
                parts

            const [localAddress, localPort] = localAddressPort.split(':')
            const [remoteAddress, remotePort] = remoteAddressPort.split(':')

            return {
                protocol,
                localAddress,
                localPort: Number(localPort),
                remoteAddress,
                remotePort: Number(remotePort),
                state,
                pid: Number(pid),
            }
        })

        return connections
    } catch (error) {
        console.error('Error executing netstat command:', error)
        return []
    }
}

export const killPort = async (port: number): Promise<boolean> => {
    const connections = await getConnectionsUsingPort(port)

    if (connections.length === 0) {
        console.log(`No connections found using port ${port}.`)
        return false
    }

    const pids = [...new Set(connections.map((conn) => conn.pid))] // Unique PIDs

    try {
        for (const pid of pids) {
            await execAsync(`taskkill /PID ${pid} /F`)
            console.log(`Killed process with PID: ${pid}`)
        }
        return true
    } catch (error) {
        console.error('Failed to kill process:', error)
        return false
    }
}
