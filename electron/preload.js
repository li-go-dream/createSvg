const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
  ChooseDirectory: (options) => ipcRenderer.invoke('choose-directory', options),
  GetDesktopPath: () => ipcRenderer.invoke('get-desktop'),
  CreateSvg: (options) => ipcRenderer.invoke('create-svg', options),
  BatchCreateSvg: (options) => ipcRenderer.invoke('batch-create-svg', options),
  openFolder: (options) => ipcRenderer.invoke('open-folder', options),
  parseExcelFile: (options) => ipcRenderer.invoke('parse-excel-file', options),
  downloadPublicFile: (options) => ipcRenderer.invoke('download-public-file', options),
})