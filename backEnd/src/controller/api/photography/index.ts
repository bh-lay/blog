/*
 * @author bh-lay
 */
import { routeItemMatched, Connect, App } from '@/core/index'
import { getTuchongData } from '@/functions/my-tuchong-data'

export async function list (route: routeItemMatched, connect: Connect, app: App) {
  const url = connect.request.url || ''
  const cacheContent = await app.cache.getWithCreate(url, ['api','photography'], async function () {
    return getTuchongData()
  })
  connect.writeJson(JSON.parse(cacheContent))
}
