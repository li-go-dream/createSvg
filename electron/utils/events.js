import { dialog, app, shell } from 'electron'
import { writeFile, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import ExcelJS from 'exceljs';

// 选择文件目录
export async function chooseDirectory(event, { defaultName = '' }) {
  const res = await dialog.showOpenDialog({
    title: '选择目录',
    defaultPath: defaultName || '',
    properties: ['openDirectory','createDirectory']
  })
  return res
}

// 获取桌面路径
export function getDesktopPath() {
  return app.getPath('desktop')
}

// 生成svg文件
export async function CreateSvg(event, { filePath, file, isOpen = true }) {
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(path.join(filePath, file.name), file.svg, 'utf-8');
  } catch (error) {
    console.log(error)
  }
}

// 批量生成svg文件
export async function BatchCreateSvg(event, { filePath, filesList }) {
  await mkdir(filePath, { recursive: true });
  const results = await Promise.allSettled(
    filesList.map(async (file) => {
      const target = path.join(filePath, file.name);
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, file.svg, 'utf-8');
      return target;
    })
  );

  return results;
}

// 打开文件夹
export function openFolder(event, filePath) {
  shell.openPath(filePath)
}

// 解析excel文件
export async function parseExcelFile(event) {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Excel 文件', extensions: ['xlsx', 'xls', 'XLSX', 'XLS'] },
      ]
    });
    if (canceled || filePaths.length === 0) return null;
    const filePath = filePaths[0];

    const ext = path.extname(filePath).toLowerCase(); // 统一转小写比较
    if (!['.xlsx', '.xls'].includes(ext)) {
      dialog.showErrorBox('文件类型错误', '请选择 Excel 文件 (.xlsx 或 .xls)');
      return [];
    }

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.readFile(filePath)
    const worksheet = workbook.getWorksheet(1)
    const JsonData = []
    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
      if (rowNumber === 1 || rowNumber === 2) return;
      JsonData.push({
        type: row.getCell(1).value ? `${row.getCell(1).value}` : '',
        typeName: row.getCell(2).value ? `${row.getCell(2).value}` : '',
        upText: row.getCell(3).value ? `${row.getCell(3).value}` : '',
        downText: row.getCell(4).value ? `${row.getCell(4).value}` : '',
        fileName: row.getCell(5).value ? `${row.getCell(5).value}` : '',
      });
    });
    return JsonData
  } catch (error) {
    return Promise.reject('文件错误');
  }
}

/**
 * 获取 public 目录下文件的真实路径
 * 开发：项目根/public/...
 * 生产：app.asar/dist/...
 */
function getPublicFilePath(relativePath) {
  if (app.isPackaged) {
    return path.join(app.getAppPath(), 'dist', relativePath);
  } else {
    return path.join(app.getAppPath(), 'public', relativePath);
  }
}

// 下载文件
export async function downloadPublicFile(event, { relativePath, defaultName }) {
  try {
    const sourcePath = getPublicFilePath(relativePath);
    const buffer = await readFile(sourcePath);

    const { canceled, filePath } = await dialog.showSaveDialog({
      title: '保存文件',
      defaultPath: path.join(app.getPath('downloads'), defaultName),
    });

    if (canceled || !filePath) return null;

    await writeFile(filePath, buffer);

    shell.showItemInFolder(filePath);

    return filePath;
  } catch (err) {
    console.error('下载失败:', err);
    throw err;
  }
}


// 
// export async function downloadPublicFile(event, { defaultName, buffer }) {
//   // 弹出保存对话框
//   const { canceled, filePath } = await dialog.showSaveDialog({
//     title: '保存文件',
//     defaultPath: path.join(app.getPath('downloads'), defaultName),
//   });

//   if (canceled || !filePath) return null;

//   // buffer 是 Uint8Array，转成 Buffer 写盘
//   await writeFile(filePath, Buffer.from(buffer));

//   // 可选：保存后打开所在文件夹
//   shell.showItemInFolder(filePath);
//   return filePath;
// }