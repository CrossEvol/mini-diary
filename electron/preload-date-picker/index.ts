// We need to wait until the main world is ready to receive the message before
// sending the port. We create this promise in the preload so it's guaranteed

import { ipcRenderer } from 'electron'
import { EChannel } from './shared/enums'

// to register the onload listener before the load event is fired.
const windowLoaded = new Promise((resolve) => {
    window.onload = resolve
})

ipcRenderer.on(EChannel.SEND_MESSAGE_PORT, async (event) => {
    await windowLoaded
    // We use regular window.postMessage to transfer the port from the isolated
    // world to the main world.
    window.postMessage(EChannel.SEND_MESSAGE_PORT, '*', event.ports)
})
