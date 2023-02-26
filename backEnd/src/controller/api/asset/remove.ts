/*
 * author bh-lay
 * demo 
 */
import { promises as fs } from 'fs'
import { App, Connect, routeItemMatched } from '@/core/types'
import { base64PathToAbsolute, hasPermission } from './utils'



// 删除
export default async function(route: routeItemMatched, connect: Connect, app: App) {
	const hasAccess = await hasPermission(connect)
	if (!hasAccess) {
		return connect.writeJson({
			code : 201,
			msg : 'no power'
		})
	}
	const pathname = base64PathToAbsolute(route.params.path as string || '')
	try {
		const stat = await fs.lstat(pathname)
		if (stat.isDirectory()) {
			return connect.writeJson({
				code : 201,
				msg: '无法删除目录！'
			})
		}
	} catch (e) {
		return connect.writeJson({
			code : 201,
			msg: '目录不存在'
		})
	}
	await fs.unlink(pathname)
	connect.writeJson({
		code : 200
	})
}
