/**
 * @author bh-lay
 * 
 */
import { routeItemMatched, Connect, App } from '@/core/types'
import { parseRequestBody } from '@/core/utils/parse'
import DB from '@/core/DB'
import power from '@/conf/power'
import parseData from './parse'


const collectionName = 'article'

export default async function (route: routeItemMatched, connect: Connect) {
	const sessionInstance = await connect.session()
	if(!sessionInstance.power(power.BLOG_EDIT)){
		connect.writeJson( {
			code: 206,
			msg: '没有权限'
		})
		return
	}
	const { params } = await parseRequestBody(connect.request)
	const data = parseData(params)
	if (!data) {
		return connect.writeJson({
			code: 2,
			msg: 'empty input'
		})
	}
	const { collection, client } = await DB.getCollection(collectionName)

	await collection.updateOne({
		id: params.id
	}, {
		$set: params
	})
	client.close()
	connect.writeJson({
		code : 200
	})
}