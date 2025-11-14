
import power from '@/conf/power'
import { getDbCollection, generateDbObjectId } from '@/database/DB'
import { routeItemMatched, Connect, App } from '@/core/index'

// 获取用户信息
async function getUserInfo (id: string) {
  const {collection, client} = await getDbCollection('user')
  const docs = await collection.find({'id' : id}).toArray()
  client.close()
  if (docs.length === 0) {
    return null
  }
  delete docs[0]['password']
  return docs[0]
}

// 修改评论
export default async function (route: routeItemMatched, connect: Connect, app: App) {
  const { params } = await connect.parseRequestBody()
  const _id = route.params.id as string || ''
  const sessionInstance = await connect.session()
  // 校验权限
  if (!sessionInstance.power(power.COMMENTS_EDIT)) {
    return connect.writeJson({
      code : 201
    })
  }

  const {collection, client} = await getDbCollection('comments')
  
  // 构建更新对象
  const updateData: Record<string, unknown> = {}
  
  // 支持 content 更新
  if (params.content !== undefined) {
    updateData.content = params.content
  }
  
  // 支持 user 数据更新
  if (params.user !== undefined) {
    // 如果提供了 uid，从数据库获取用户信息
    const uidValue = params.uid as string | undefined
    if (uidValue && typeof uidValue === 'string') {
      const userInfo = await getUserInfo(uidValue)
      updateData.uid = uidValue
      updateData.user = userInfo
    } else {
      // 否则直接使用提供的 user 对象
      updateData.user = params.user
      // 如果提供了 user 但没有 uid，清空 uid
      if (params.user === null) {
        updateData.uid = null
      }
    }
  } else if (params.uid !== undefined) {
    // 如果只提供了 uid，更新 uid 并获取用户信息
    const uidValue = params.uid as string | null | undefined
    updateData.uid = uidValue
    if (uidValue && typeof uidValue === 'string') {
      const userInfo = await getUserInfo(uidValue)
      updateData.user = userInfo
    } else {
      updateData.user = null
    }
  }
  
  // 如果没有要更新的数据，返回错误
  if (Object.keys(updateData).length === 0) {
    client.close()
    return connect.writeJson({
      code : 400,
      msg: 'No valid fields to update'
    })
  }
  
  await collection.updateOne({
    _id: generateDbObjectId(_id)
  }, {
    $set: updateData
  })

  client.close()
  connect.writeJson({
    code : 200
  })
  // 清除所有评论缓存
  app.cache.clear('comment')
}