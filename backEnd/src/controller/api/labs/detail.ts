/*
 * @author bh-lay
 */

import DB from '@/core/DB'
import { routeItemMatched, Connect, App } from '@/core/types'

async function getDetail (articleID: string, format: string) {
	let resJSON: Record<string, any> = {
		code: 200,
		id : articleID,
		format : format,
		msg: '',
		detail: null,
	}
	const {collection, client} = await DB.getCollection('labs')

	const docs = await collection.find({
		id: articleID
	}).toArray()
	client.close()
	if(!docs || docs.length === 0){
		resJSON.code = 2
		resJSON.msg = 'could not find this blog !'
	} else {
		resJSON.detail = docs[0]
	}
	return resJSON


}
export default async function (route: routeItemMatched, connect: Connect, app: App) {
	var url = connect.request.url || ''
	const cacheContent = await app.cache.getWithCreate(url, ['api','labs'], async function(){
		let data = connect.url.search
		let id = route.params.id as string
		// 内容格式 html/markdown
		let format = data.format as string || 'markdown'
		return await getDetail(id, format)
	})
	connect.writeJson(JSON.parse(cacheContent))
}
