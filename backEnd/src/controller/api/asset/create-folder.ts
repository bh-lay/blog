/*
 * author bh-lay
 * demo 
 */
import { promises as fs } from 'fs'
import { App, Connect, routeItemMatched } from "@/core/types"
import { hasPermission, relativePathToAbsolute } from "./utils"
import { parseRequestBody } from "@/core/utils/parse"
import { isFileExists } from '@/controller/img-robber/static-file'


export default async function(route: routeItemMatched, connect: Connect, app: App) {

	const { params } = await parseRequestBody(connect.request)

	const hasAccess = await hasPermission(connect)
	if (!hasAccess) {
		return connect.writeJson({
			code : 201,
			msg : 'no power'
		})
	}

	const root = params.pathname as string || ''
	var dirName = params.name as string || ''
	// 转换成可操作路径
	const pathname = relativePathToAbsolute(root)


	let newPath = pathname + '/' + dirName
	
	// 检测是否同名
	var exists = await isFileExists(newPath)
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