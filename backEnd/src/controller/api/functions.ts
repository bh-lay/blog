/**
 * @author bh-lay
 */
import { App, Connect, routeItemMatched } from '@/core/types'
import syncMoment from '@/functions/moment/index'
import { updateFrom720 } from '@/functions/my-720-data'
import { updateFromTuchong } from '@/functions/my-tuchong-data'


export default async function(route: routeItemMatched, connect: Connect, app: App){
	const act = route.params.act
	const sessionInstance = await connect.session()
	if (sessionInstance.get('user_group') !== 'admin') {
		return connect.writeJson( {
			code: 201,
			'msg': 'no power !'
		})
	}
	const responseJson = {
		code: 200,
		msg: 'update success !'
	}
	switch (act) {
	case 'update720yun':
		await updateFrom720()
		break
	case 'updateTuchong':
		await updateFromTuchong()
		break
	case 'syncMoment':
		await syncMoment()
		break
	default:
		responseJson.code = 203
		responseJson.msg = 'wrong action !'
	}
	connect.writeJson( responseJson)
}
