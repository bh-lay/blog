/**
 * @author bh-lay
 * 
 */
/** ************************************************************
***************************************************************/
import DB from '@/database/DB'
import power from '@/conf/power'
import { App, Connect, routeItemMatched } from '@/core/index'


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
  if (!sessionInstance.power(power.BLOG_DELETE)) {
    return connect.writeJson({
      code : 201
    })
  }
  const {collection, client} = await DB.getCollection('article')

  await collection.deleteOne({
    id : ID
  })
  client.close()

  connect.writeJson({
    code : 200
  })
  // 清除所有缓存
  app.cache.clear('comment')
}
