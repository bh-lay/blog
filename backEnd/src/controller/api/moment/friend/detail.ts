/*
 * @author bh-lay
 */

import { routeItemMatched, Connect } from '@/core/index'
import { push as pushAnalysis } from '@/functions/analysis/index'

import { getDbCollection } from '@/database/DB'

const collectionName = 'friends'


// 获取好友详情
export default async function (route: routeItemMatched, connect: Connect) {
  const friendID = route.params.id

  const {collection, client} = await getDbCollection(collectionName)

  const docs = await collection.find({
    id: friendID
  }).toArray()
  client.close()
  if (!docs || docs.length==0) {
    connect.writeJson({
      code: 2,
      msg: 'could not find this blog !'
    })
  } else {
    connect.writeJson({
      code: 2,
      detail: docs[0]
    })
  }
  // 打点统计
  pushAnalysis(connect.request, connect.response, {
    type: 'view',
    params: {
      catalog: 'moment-friend',
      id: friendID
    }
  })
}