/*
 * author bh-lay
 * demo 
 */
import { promises as fs } from 'fs'
import { Connect, routeItemMatched, isFileExists } from '@/core/index'
import { base64PathToAbsolute, hasPermission } from './utils'
import formidable from 'formidable'

async function moveFile (fromPath: string, toDir: string, newFilename: string) {
  const newPath  = toDir + '/' + newFilename
  const exists = await isFileExists(newPath)
  if (exists) {
    return {
      name: newFilename,
      success: false
    }
  }
	
  await fs.rename(fromPath, newPath)
  return {
    name: newFilename,
    success: true,
  }
}

// 上传文件
export default async function (route: routeItemMatched, connect: Connect) {
  const uploadToPathname = base64PathToAbsolute(route.params.path as string || '')
  const hasAccess = await hasPermission(connect)
  if (!hasAccess) {
    return connect.writeJson({
      code : 201,
      msg : 'no power'
    })
  }
  const { files } = await connect.parseRequestBody()

  if (!files) {
    return connect.writeJson({
      code : 201
    })
  }

  let fileList: formidable.File[] = []
  if (Array.isArray(files.file)) {
    fileList = files.file
  } else {
    fileList = [files.file]
  }
  const exists = await isFileExists(uploadToPathname)
  if (!exists) {
    return connect.writeJson({
      code : 202
    })
  }
  const moveResult = await Promise.all(fileList.map(async function (file) {
    console.log('file', file)
    return await moveFile(file.filepath, uploadToPathname, file.originalFilename || file.newFilename)
  }))
  connect.writeJson({
    code : 200,
    files: moveResult,
  })
}
