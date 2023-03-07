/**
 * @author bh-lay
 * 
 */

import { routeItemMatched, Connect } from '@/core/index'
import power from '@/conf/power'
import DB from '@/core/DB'

const collectionName = 'friends'

// // 删除
export default async function (route: routeItemMatched, connect: Connect) {
	const ID = route.params.id as string || ''
	if(!ID || ID.length<2){
		return connect.writeJson({
			code : 2,
			'msg' : 'please input [id] for del !'
		})
	}
	const sessionInstance = await connect.session()
	// 校验权限
	if(!sessionInstance.power(power.BLOG_DELETE)){
		return connect.writeJson({
			code : 201
		})
	}

	const { collection, client }= await DB.getCollection(collectionName)

	await collection.deleteOne({
		id : ID
	})
	client.close()
	connect.writeJson({
		code : 200
	})
}
