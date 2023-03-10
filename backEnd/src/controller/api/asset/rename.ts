/*
 * author bh-lay
 * demo 
 */

import { promises as fs } from 'fs'
import { App, Connect, routeItemMatched } from '@/core/index'
import { base64PathToAbsolute, hasPermission } from './utils'
import { isFileExists } from '@/controller/img-robber/static-file'

// 重命名
export default async function(route: routeItemMatched, connect: Connect, app: App) {
	const hasAccess = await hasPermission(connect)
	if (!hasAccess) {
		return connect.writeJson({
			code : 201,
			msg : 'no power'
		})
	}
	const pathname = base64PathToAbsolute(route.params.path as string || '')

	const { params } = await connect.parseRequestBody()

	const newFileName = params.newName as string || ''
	if (pathname.length < 1 || newFileName.length < 1) {
		return connect.writeJson({
			code : 201,
			msg: '参数不全'
		})
	}
	const newPath = pathname.replace(/[^\/]+$/, newFileName)
	// 检测是否同名
	const exists = await isFileExists(newPath)
	if (exists) {
		return connect.writeJson({
			code : 201,
			msg: '文件已存在'
		})
	}
	await fs.rename(pathname, newPath)
	connect.writeJson({
		code : 200
	})
}