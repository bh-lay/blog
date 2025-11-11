/*
 * @author bh-lay
 */
import { routeItemMatched, Connect, App } from '@/core/index'
import power from '@/conf/power'

import { getDbCollection } from '@/database/DB'
import parseData from './parse'
import { createID } from '@/lib/utils'

const collectionName = 'article'

export default async function (route: routeItemMatched, connect: Connect, app: App) {
  const sessionInstance = await connect.session()
  if (!sessionInstance.power(power.BLOG_CREATE)) {
    connect.writeJson( {
      code: 206,
      msg: '没有权限'
    })
    return
  }
  const { params } = await connect.parseRequestBody()
	
  const data = parseData(params)
  if (!data) {
    return connect.writeJson( {
      code: 204,
      msg: '请输入完整数据！'
    })
  }
  const {collection, client} = await getDbCollection(collectionName)
  data.id = createID()
  await collection.insertOne(data)
  client.close()
  // 清除文章标签相关缓存
  app.cache.clear('tags,article')
  connect.writeJson( {
    code: 200
  })
}
