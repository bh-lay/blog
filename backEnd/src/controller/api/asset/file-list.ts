import { promises as fs } from 'fs'
import { App, Connect, routeItemMatched } from '@/core/index'
import { base64PathToAbsolute, hasPermission } from './utils'


// 获取某一目录下文件（文件夹）列表
export default async function (route: routeItemMatched, connect: Connect, app: App) {
  const hasAccess = await hasPermission(connect)
  if (!hasAccess) {
    return connect.writeJson({
      code : 201,
      msg : 'no power'
    })
  }
  const pathname = base64PathToAbsolute(route.params.path as string)
  try {
    const stat = await fs.lstat(pathname)
    if (!stat.isDirectory()) {
      return connect.writeJson({
        code: 201,
        msg: 'not support file reader'
      })
    }
  } catch (e) {
    return connect.writeJson({
      code: 404,
      msg: 'Directory does not exist!'
    })
  }
	
  // 读取目录

  const subFileList = await fs.readdir(pathname)
  const files = await Promise.all(subFileList.map(async function (filename) {
    const filePath = pathname + '/' + filename
    const stat = await fs.lstat(filePath)
    return {
      name : filename,
      isdir : stat.isDirectory()
    }
  }))
  connect.writeJson({
    code: 200, 
    files
  })
  // if(err){
  // 	json.code = 404
  // 	json.msg = 
  // }

}