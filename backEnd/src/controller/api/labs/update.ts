/**
 * @author bh-lay
 * 
 */
import DB from '@/core/DB'
import { routeItemMatched, Connect, App } from '@/core/types'
import power from '@/conf/power'
import parseData from './parse'
import { parseRequestBody } from '@/core/utils/parse'
let collectionName = 'labs'

export default async function (route: routeItemMatched, connect: Connect, app: App) {
	const sessionInstance = await connect.session()
	if(!sessionInstance.power(power.LABS_EDIT)){
		connect.writeJson( {
			code: 206,
			msg: '没有权限'
		})
		return
	}
	const { params } = await parseRequestBody(connect.request)
	let id = route.params.id
	let data = parseData(params)
	if (!data) {
		return connect.writeJson({
			code: 2,
			msg: '请输入完整数据！'
		})
	}
	const {collection, client} = await DB.getCollection(collectionName)
	await collection.updateOne({
		id
	}, {
		$set: params
	})

	app.cache.clear('comment')
	client.close()

	connect.writeJson({
		code: 1,
		msg: 'edit success !'
	})
}