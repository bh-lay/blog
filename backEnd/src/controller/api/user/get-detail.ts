/**
 * @author bh-lay
 * 
 */
import DB from '@/core/DB'
import { routeItemMatched, Connect, App } from '@/core/types'
import { parseRequestBody } from '@/core/utils/parse'

/**
 * 获取用户信息
 */
async function getUserDetail(userID: string){
	const {collection, client} = await DB.getCollection('user')

	const docs = await collection.find({
		id: userID
	}).toArray()
	client.close()

	if(docs.length === 0){
		return null
	}
	var item = docs[0]
	if(item && item['password']){
		delete item['password']
	}
	return item
}
// 获取用户信息
export default async function (route: routeItemMatched, connect: Connect, app: App){
	const { params = {} } = await parseRequestBody(connect.request)

		// 获取指定用户信息
	if(params.uid){
		const userDetail = await getUserDetail(params.uid as string)

		return connect.writeJson({
			code : 200,
			detail : userDetail
		})
	}
	// 获取自己的用户信息
	const sessionInstance = await connect.session()
	// session存入comment预留信息
	sessionInstance.set({
		comment_auth : 'ready',
		loginAuth : 'ready'
	})
		
	const uid = sessionInstance.get('uid')
	if (typeof uid === 'string') {
		const detail = getUserDetail(uid)
		return connect.writeJson({
			code : 200,
			detail : detail
		})
	}
	return connect.writeJson({
		code : 201
	})
}