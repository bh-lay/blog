/**
 * @author bh-lay
 * 
 */
import power from '@/conf/power'
import { getDbCollection, generateDbObjectId } from '@/database/DB'
import { routeItemMatched, Connect, App } from '@/core/index'

// 获取评论详情
export default async function (route: routeItemMatched, connect: Connect, app: App) {
  const ID = (route.params.id || '').toString()
  if (!ID || ID.length < 2) {
    return connect.writeJson({
      code: 2,
      msg: 'please input [id] for del !'
    })
  }
  const sessionInstance = await connect.session()
  // 校验权限
  if (!sessionInstance.power(power.COMMENTS_DELETE)) {
    return connect.writeJson({
      code : 201
    })
  }
  const {collection, client} = await getDbCollection('comments')

  await collection.deleteOne({
    _id: generateDbObjectId(ID)
  })
  client.close()
	
  connect.writeJson({
    code : 200
  })
  // 清除所有缓存
  app.cache.clear('comment')
}
