const { ipcRenderer } = require('electron')

ipcRenderer.on('port', e => {
  console.log(e.ports)
  // port received, make it globally available.
  window.electronMessagePort = e.ports[0]

  window.electronMessagePort.onmessage = messageEvent => {
    // handle message
    console.log(messageEvent)
  }
})