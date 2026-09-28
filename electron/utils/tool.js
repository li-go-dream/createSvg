import { Menu, app, globalShortcut } from 'electron';

export function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '退出',
          role: 'quit'
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: '查看',
      submenu: [
        { role: 'reload' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' }
      ]
    }
  ]

  // 开发环境才增加开发者工具
  if (!app.isPackaged) {
    template[2].submenu.push({
      type: 'separator'
    })

    template[2].submenu.push({
      role: 'toggleDevTools'
    })
  }

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

export function disbaleDevTools() {
  if (app.isPackaged) {
    globalShortcut.register('CommandOrControl+Shift+I', () => {})
    globalShortcut.register('Command+Option+I', () => {})
    globalShortcut.register('F12', () => {})
  }
}