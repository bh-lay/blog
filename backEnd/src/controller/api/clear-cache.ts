/**
 * @author bh-lay
 */
import { Connect, routeItemMatched, App } from '@/core/index'

export default async function (route: routeItemMatched, connect: Connect, app: App) {
  // FIXME: add power check
  const typeStr = connect.url.search.type as string || ''
  app.cache.clear(typeStr)
  connect.writeJson({
    code: 200,
    msg : 'clear cache :[' + typeStr + '] completely !'
  })
}
