/*
 * @author bh-lay
 * 
 */
import { routeItemMatched, Connect, App } from '@/core/types'
import { push as pushAnalysis } from '@/functions/analysis/index'
import { base64Decode } from '@/lib/utils'

export default async function (route: routeItemMatched, connect: Connect, app: App) {
	// 获取 URL 配置参数
	let target = base64Decode(route.params.target as string || '')
	target = decodeURIComponent(target)
	if (target.indexOf('http') !== 0) {
		connect.writeJson({
			code: 300,
		})
	}
	pushAnalysis(connect.request, connect.response, {
		type: 'redirect',
		params: {
			target
		}
	})
	const html = await connect.views('system/redirect', {
		target
	})
	connect.writeHTML(200, html)
}