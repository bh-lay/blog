import DB from '@/core/DB'
import { routeItemMatched, Connect, App } from '@/core/types'

// 获取评论详情
export default async function(route: routeItemMatched, connect: Connect){
	let id = (route.params.id || '').toString()

	if(!id || id.length < 2){
		return connect.writeJson({
			code: 500
		})
	}
	const {collection, client} = await DB.getCollection('comments')
	const doc = await collection.findOne({
		_id: new DB.ObjectId(id)
	})
	client.close()
	if(!doc){
		return connect.writeJson({
			code: 500
		})
	}else{
		return connect.writeJson({
			code: 200,
			detail: doc
		})
	}
}