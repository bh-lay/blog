/**
 * @author bh-lay
 * 
 */
import DB from '@/database/DB'
import { routeItemMatched, Connect, App } from '@/core/index'
import power from '@/conf/power'
import parseData from './parse'
import { createID } from '@/lib/utils'

export default async function (route: routeItemMatched, connect: Connect, app: App) {
	const sessionInstance = await connect.session()
	if(!sessionInstance.power(power.LABS_CREATE)){
		return connect.writeJson( {
			code: 206,
			msg: '没有权限'
		})
	}
	const { params } = await connect.parseRequestBody()
	const data = parseData(params)
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
