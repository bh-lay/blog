/*
 * author bh-lay
 * demo 
 */

import { promises as fs } from 'fs'
import { App, Connect, routeItemMatched } from "@/core/types"
import { base64PathToAbsolute, hasPermission } from "./utils"
import { parseRequestBody } from '@/core/utils/parse'
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

	const { params } = await parseRequestBody(connect.request)

	let newFileName = params.newName as string || ''
		if (pathname.length < 1 || newFileName.length < 1) {
			return connect.writeJson({
				code : 201,
				msg: '参数不全'
			})
		}
		var newPath = pathname.replace(/[^\/]+$/, newFileName)
		// 检测是否同名
		var exists = await isFileExists(newPath)
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