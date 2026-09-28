import { ipcMain } from 'electron'
import { 
  chooseDirectory,
  getDesktopPath,
  CreateSvg,
  BatchCreateSvg,
  openFolder,
  parseExcelFile,
  downloadPublicFile
} from './events.js'

export default function () {
  ipcMain.handle('choose-directory', chooseDirectory)
  ipcMain.handle('get-desktop', getDesktopPath)
  ipcMain.handle('create-svg', CreateSvg)
  ipcMain.handle('batch-create-svg', BatchCreateSvg)
  ipcMain.handle('open-folder', openFolder)
  ipcMain.handle('parse-excel-file', parseExcelFile)
  ipcMain.handle('download-public-file', downloadPublicFile);
}