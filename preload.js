const {
    contextBridge,
    ipcRenderer
} = require("electron")

contextBridge.exposeInMainWorld(
    "api", {
        invoke: (channel, data) => {
            let validChannels = ["notification", "storage"]
            if (validChannels.includes(channel)){
                return ipcRenderer.invoke(channel, data)
            }
        },
    }
)