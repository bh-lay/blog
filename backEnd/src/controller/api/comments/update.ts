
import power from '@/conf/power'
import DB from '@/database/DB'
import { routeItemMatched, Connect, App } from '@/core/index'

// 修改评论
export default async function (route: routeItemMatched, connect: Connect, app: App) {
  const { params } = await connect.parseRequestBody()
  const _id = route.params.id
  const sessionInstance = await connect.session()
  // 校验权限
  if (!sessionInstance.power(power.COMMENTS_EDIT)) {
    return connect.writeJson({
      code : 201
    })
  }
  const {collection, client} = await DB.getCollection('comments')
  await collection.updateOne({
    _id: new DB.ObjectId(_id)
  }, {
    $set: {
      content: params.content
    }
  })

  client.close()
  connect.writeJson({
    code : 200
  })
  // 清除所有评论缓存
  app.cache.clear('comment')
}