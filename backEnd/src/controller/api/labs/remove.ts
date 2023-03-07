/**
 * @author bh-lay
 * 
 */
import DB from '@/core/DB'
import { routeItemMatched, Connect, App } from '@/core/index'
import power from '@/conf/power'
import parseData from './parse'
import { parseRequestBody } from '@/core/utils/parse'

// 删除
export default async function (route: routeItemMatched, connect: Connect, app: App) {
	const ID = route.params.id as string || ''
	if(ID.length < 2){
		return connect.writeJson({
			code : 2,
			'msg' : 'please input [id] for del !'
		})
	}
	const sessionInstance = await connect.session()
	// 校验权限
	if(!sessionInstance.power(power.LABS_DELETE)){
		return connect.writeJson({
			code : 201
		})
	}

	const {collection, client} = await DB.getCollection('labs')

	await collection.deleteOne({
		id : ID
	})
	client.close()
	// 清除所有缓存
	app.cache.clear('labs')

	connect.writeJson({
		code : 200
	})
}