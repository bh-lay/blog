/**
 * @author bh-lay
 * 
 */
import { routeItemMatched, Connect, App } from '@/core/index'
import { getDbCollection } from '@/database/DB'
import power from '@/conf/power'
import parseData from './parse'


const collectionName = 'article'

export default async function (route: routeItemMatched, connect: Connect, app: App) {
  const sessionInstance = await connect.session()
  if (!sessionInstance.power(power.BLOG_EDIT)) {
    connect.writeJson( {
      code: 206,
      msg: '没有权限'
    })
    return
  }
  const { params } = await connect.parseRequestBody()
  const data = parseData(params)
  if (!data) {
    return connect.writeJson({
      code: 2,
      msg: 'empty input'
    })
  }
  const { collection, client } = await getDbCollection(collectionName)

  await collection.updateOne({
    id: params.id
  }, {
    $set: params
  })
  client.close()
  // 清除文章标签相关缓存
  app.cache.clear('tags,article')
  connect.writeJson({
    code : 200
  })
}
