/**
 * @author bh-lay
 * 
 */
import DB from '@/core/DB'
import { routeItemMatched, Connect, App } from '@/core/types'
import power from '@/conf/power'
import parseData from './parse'
import { parseRequestBody } from '@/core/utils/parse'
import { createID } from '@/core/utils'

export default async function (route: routeItemMatched, connect: Connect, app: App) {
	const sessionInstance = await connect.session()
	if(!sessionInstance.power(power.LABS_CREATE)){
		return connect.writeJson( {
			code: 206,
			msg: '没有权限'
		})
	}
	const { params } = await parseRequestBody(connect.request)
	let data = parseData(params)
	if (!data) {
		return connect.writeJson({
			code: 2,
			msg: '请输入完整数据！'
		})
	}
	const {collection, client} = await DB.getCollection('labs')

	data.id = createID()
	await collection.insertOne(data)

	client.close()
	app.cache.clear('labs')
	connect.writeJson({
		code: 1,
		msg: 'create success !'
	})
}