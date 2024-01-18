/**
 * @author bh-lay
 * 
 */

import { routeItemMatched, Connect } from '@/core/index'
import power from '@/conf/power'

import { getDbCollection } from '@/database/DB'
import parseData from './parse'

const collectionName = 'friends'


export default async function (route: routeItemMatched, connect: Connect) {
  const sessionInstance = await connect.session()
  if (!sessionInstance.power(power.BLOG_EDIT)) {
    return connect.writeJson( {
      code: 206,
      msg: '没有权限'
    })
  }
  const { params } = await connect.parseRequestBody()
  const data = parseData(params)
  if (!data) {
    return connect.writeJson({
      code: 2,
      msg: '请输入完整数据！'
    })
  }
  const { collection, client } = await getDbCollection(collectionName)
  await collection.updateOne({
    id: params.id
  }, {
    $set: params
  })

  client.close()
  connect.writeJson({
    code: 1,
    msg: 'edit success !'
  })
}
