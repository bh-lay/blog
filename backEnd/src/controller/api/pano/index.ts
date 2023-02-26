/*
 * @author bh-lay
 */
import { routeItemMatched, Connect, App } from '@/core/types'
import { get720Data } from '@/functions/my-720-data'

export async function list (route: routeItemMatched, connect: Connect, app: App) {
	const url = connect.request.url || ''
	const cacheContent = await app.cache.getWithCreate(url,['api','pano'], function(){
		return get720Data()
	})
	connect.writeJson(JSON.parse(cacheContent))
}
