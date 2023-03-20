/**
 * @author bh-lay
 */
import { routeItemMatched, Connect } from '@/core/index'
import githubSnsLogin from './github'

export default async function (route: routeItemMatched, connect: Connect) {
  if (route.params.from === 'github') {
    return await githubSnsLogin(connect)
  }
  connect.writeJson({
    code : 500
  })
}