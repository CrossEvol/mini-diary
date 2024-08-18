// We need to wait until the main world is ready to receive the message before
// sending the port. We create this promise in the preload so it's guaranteed

import { SendMessagePortData } from 'ce-shard'
import { EChannel, EditorContentData } from 'ce-shard'
import { ipcRenderer } from 'electron'

// to register the onload listener before the load event is fired.
const windowLoaded = new Promise((resolve) => {
    window.onload = resolve
})

ipcRenderer.on(
    EChannel.SEND_MESSAGE_PORT,
    async (event, value: Omit<SendMessagePortData, 'channel'>) => {
        await windowLoaded
        // We use regular window.postMessage to transfer the port from the isolated
        // world to the main world.
        window.postMessage(
            {
                ...value,
                channel: EChannel.SEND_MESSAGE_PORT,
            },
            '*',
            event.ports
        )
    }
)

window.onmessage = (event: MessageEvent<EditorContentData>) => {
    // event.source === window means the message is coming from the preload
    // script, as opposed to from an <iframe> or other source.
    if (
        event.source === window &&
        event.data.channel === EChannel.EDITOR_CONTENT
    ) {
        console.log('transmit the EditorContentData...')
        ipcRenderer.send(EChannel.EDITOR_CONTENT, event.data)
    }
}
