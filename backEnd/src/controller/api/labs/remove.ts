/**
 * @author bh-lay
 * 
 */
import { getDbCollection } from '@/database/DB'
import { routeItemMatched, Connect, App } from '@/core/index'
import power from '@/conf/power'

// 删除
export default async function (route: routeItemMatched, connect: Connect, app: App) {
  const ID = route.params.id as string || ''
  if (ID.length < 2) {
    return connect.writeJson({
      code : 2,
      'msg' : 'please input [id] for del !'
    })
  }
  const sessionInstance = await connect.session()
  // 校验权限
  if (!sessionInstance.power(power.LABS_DELETE)) {
    return connect.writeJson({
      code : 201
    })
  }

  const {collection, client} = await getDbCollection('labs')

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