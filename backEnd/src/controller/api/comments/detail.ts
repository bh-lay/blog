import { getDbCollection, generateDbObjectId } from '@/database/DB'
import { routeItemMatched, Connect } from '@/core/index'

// 获取评论详情
export default async function (route: routeItemMatched, connect: Connect) {
  const id = (route.params.id || '').toString()

  if (!id || id.length < 2) {
    return connect.writeJson({
      code: 500
    })
  }
  const {collection, client} = await getDbCollection('comments')
  const doc = await collection.findOne({
    _id: generateDbObjectId(id)
  })
  client.close()
  if (!doc) {
    return connect.writeJson({
      code: 500
    })
  } else {
    return connect.writeJson({
      code: 200,
      detail: doc
    })
  }
}