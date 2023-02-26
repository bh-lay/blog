/**
 * @author bh-lay
 */
import { routeItemMatched, Connect, App } from '@/core/types'
import githubSnsLogin from './github'

export default async function(route: routeItemMatched, connect: Connect, app: App) {
	if(route.params.from === 'github'){
		return await githubSnsLogin(connect)
	}
	connect.writeJson({
		code : 500
	})
}