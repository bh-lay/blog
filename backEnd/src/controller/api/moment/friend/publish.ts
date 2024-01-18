/**
 * @author bh-lay
 * 
 */

import { routeItemMatched, Connect } from '@/core/index'
import power from '@/conf/power'
import { getDbCollection } from '@/database/DB'
import parseData from './parse'
import { createID } from '@/lib/utils'

const collectionName = 'friends'


export default async function (route: routeItemMatched, connect: Connect) {
  const sessionInstance = await connect.session()
  if (!sessionInstance.power(power.BLOG_CREATE)) {
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
  data.id = createID()
  await collection.insertOne(data)
  client.close()
  connect.writeJson({
    code: 1,
    msg: 'create success !'
  })
}
