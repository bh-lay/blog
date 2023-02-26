/*
 * @author bh-lay
 */
import { routeItemMatched, Connect } from '@/core/types'
import power from '@/conf/power'
import { getCache, setCache, removeCache } from '@/functions/moment/cache'
import { parseRequestBody } from '@/core/utils/parse'

async function get(route: routeItemMatched, connect: Connect) {
	let cacheName =  route.params.name as string || ''
	const data = await getCache(cacheName)
	if (data) {
		connect.writeJson( {
			code: 200,
			content: data.content
		})
	} else {
		connect.writeJson( {
			code: 404
		})
	}
}
async function put(route: routeItemMatched, connect: Connect) {
	let cacheName =  route.params.name as string || ''
	const sessionInstance = await connect.session()
	if(!sessionInstance.power(power.BLOG_EDIT)){
		return connect.writeJson( {
			code: 206,
			msg: '没有权限'
		})
	}
	const { params } = await parseRequestBody(connect.request)
	let content = JSON.parse(params.content as string)
	await setCache(cacheName, content)
	connect.writeJson({
		code: 1,
		msg: 'edit success !'
	})
}

// 删除
export async function deleteMethod(route: routeItemMatched, connect: Connect) {
	let cacheName = route.params.name as string || ''
	if(cacheName.length < 2){
		return connect.writeJson({
			code : 2,
			'msg' : 'please input [cache name] for del !'
		})
	}
	const sessionInstance = await connect.session()
	// 校验权限
	if(!sessionInstance.power(power.BLOG_DELETE)){
		return connect.writeJson({
			code : 201
		})
	}
	await removeCache(cacheName)
	connect.writeJson({
		code : 200
	})
}

export default {
	get,
	put,
	delete: deleteMethod
}
