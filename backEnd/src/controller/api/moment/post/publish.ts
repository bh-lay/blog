/**
 * @author bh-lay
 * 
 */
import { routeItemMatched, Connect } from '@/core/types'
import power from '@/conf/power'
import { parseRequestBody } from '@/core/utils/parse'

import DB from '@/core/DB'
import parseData from './parse'
import { createID } from '@/core/utils'

const collectionName = 'moment_post'


export default async function (route: routeItemMatched, connect: Connect) {
	const sessionInstance = await connect.session()
	if(!sessionInstance.power(power.BLOG_CREATE)){
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
	const { collection, client } = await DB.getCollection(collectionName)

	data.id = createID()
	await collection.insertOne(data)

	client.close()
	return connect.writeJson({
		code: 1,
		msg: 'create success !'
	})
}