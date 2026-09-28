import path from 'path';
import { app, BrowserWindow, Menu } from 'electron/main'
import onEnvent from './utils/index.js'
import { createMenu, disbaleDevTools } from './utils/tool.js'

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    webPreferences: {
      preload: path.join(import.meta.dirname, 'preload.js')
    }
  })

  // 开发环境加载 Vite 服务器，生产环境加载打包文件
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(import.meta.dirname, '../dist/index.html'));
    win.webContents.closeDevTools()
  }
  win.setResizable(false)
}

app.whenReady().then(() => {
  onEnvent()
  createWindow()
  createMenu()
  disbaleDevTools()
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

