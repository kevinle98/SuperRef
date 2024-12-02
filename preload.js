const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    toggleAlwaysOnTop: (value) => ipcRenderer.send('toggle-always-on-top', value)
});