/*
 * @author bh-lay
 */
import { routeItemMatched, Connect } from '@/core/index'
import power from '@/conf/power'

import DB from '@/database/DB'
import parseData from './parse'
import { createID } from '@/core/utils'

const collectionName = 'article'

export default async function(route: routeItemMatched, connect: Connect) {
	const sessionInstance = await connect.session()
	if(!sessionInstance.power(power.BLOG_CREATE)){
		connect.writeJson( {
			code: 206,
			msg: '没有权限'
		})
		return
	}
	const { params } = await connect.parseRequestBody()
	
	const data = parseData(params)
	if (!data) {
		return connect.writeJson( {
			code: 204,
			msg: '请输入完整数据！'
		})
	}
	const {collection, client} = await DB.getCollection(collectionName)
	data.id = createID()
	await collection.insertOne(data)
	client.close()
	connect.writeJson( {
		code: 200
	})
}
