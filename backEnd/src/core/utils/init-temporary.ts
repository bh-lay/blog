/**
 * @author bh-lay
 */
import path from 'path'
import { promises as fs } from 'fs'
import { isFileExists } from './index'

async function autoCreateFolder (rootPath: string, folderName: string) {
  const newPath = path.join(rootPath, folderName)
  // 检测是否同名
  const exists = await isFileExists(newPath)
  if (!exists) {
    await fs.mkdir(newPath)
  }
}
export default async function (rootPath: string) {
  const exists = await isFileExists(rootPath)
  if (!exists) {
    throw new Error(`temporary path not exist: ${rootPath}`)
  }
  await autoCreateFolder(rootPath, '/session')
  await autoCreateFolder(rootPath, '/img-robber')
  await autoCreateFolder(rootPath, '/cache')
}
