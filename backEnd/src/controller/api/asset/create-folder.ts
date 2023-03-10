/*
 * author bh-lay
 * demo 
 */
import { promises as fs } from 'fs'
import { App, Connect, routeItemMatched } from '@/core/index'
import { hasPermission, relativePathToAbsolute } from './utils'
import { isFileExists } from '@/controller/img-robber/static-file'


export default async function(route: routeItemMatched, connect: Connect, app: App) {

	const { params } = await connect.parseRequestBody()

	const hasAccess = await hasPermission(connect)
	if (!hasAccess) {
		return connect.writeJson({
			code : 201,
			msg : 'no power'
		})
	}

	const root = params.pathname as string || ''
	const dirName = params.name as string || ''
	// 转换成可操作路径
	const pathname = relativePathToAbsolute(root)


	const newPath = pathname + '/' + dirName
	
	// 检测是否同名
	const exists = await isFileExists(newPath)
	if (exists) {
		return connect.writeJson({
			code : 201,
			msg: '目录已存在'
		})
	}

	await fs.mkdir(newPath)
	return connect.writeJson({
		code : 200
	})
}
