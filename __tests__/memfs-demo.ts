// read-hello-world.js
import fs from 'node:fs'

export function readHelloWorld(path: string) {
    return fs.readFileSync(path).toString()
}

export function writeHelloWorld(path: string, data: string) {
    fs.writeFileSync(path, data)
}
