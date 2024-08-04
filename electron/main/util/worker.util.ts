import { ipcMain } from 'electron'
import path from 'node:path'
import { Worker } from 'node:worker_threads'
import { EChannel } from '../shared/enums'

type Message = {
    port: number
}

export const startServerInWorker = () => {
    const worker = new Worker(path.resolve(__dirname, '..', 'worker/worker.js'))

    worker.on('message', (message: Message) => {
        console.log('Received message from Hono worker:', message)
        ipcMain.emit(EChannel.PORT_FROM_WORKER, message)
    })
    worker.on('error', (err) => {
        console.error('Worker thread error:', err)
    })
    worker.on('exit', (code) => {
        if (code !== 0) console.error(`Worker stopped with exit code ${code}`)
    })
}
