/**
 * 批量删除评论
 * @author bh-lay
 *
 * DELETE /api/comments
 * body: { "ids": ["<ObjectId>", "<ObjectId>", ...] }
 */
import power from '@/conf/power'
import { getDbCollection, generateDbObjectId } from '@/database/DB'
import { routeItemMatched, Connect, App } from '@/core/index'
import * as mongodb from 'mongodb'

// 单次请求最多允许删除的评论数，防止一次请求删除过多数据
const MAX_BATCH_SIZE = 500

export default async function (route: routeItemMatched, connect: Connect, app: App) {
  const { params } = await connect.parseRequestBody()

  // 校验权限（敏感操作，先于参数校验）
  const sessionInstance = await connect.session()
  if (!sessionInstance.power(power.COMMENTS_DELETE)) {
    return connect.writeJson({
      code : 201
    })
  }

  const rawIds = params.ids
  // ids 必须是非空数组
  if (!Array.isArray(rawIds) || rawIds.length === 0) {
    return connect.writeJson({
      code : 400,
      msg : 'please provide [ids] as a non-empty array !'
    })
  }
  // 数量上限
  if (rawIds.length > MAX_BATCH_SIZE) {
    return connect.writeJson({
      code : 400,
      msg : `too many ids, max ${MAX_BATCH_SIZE} per request !`
    })
  }

  // 校验 ObjectId 合法性并去重（保持 es5 兼容，不用 Set）
  const ids: string[] = []
  for (let i = 0; i < rawIds.length; i++) {
    const item = rawIds[i]
    const id = typeof item === 'string' ? item.trim() : ''
    if (!mongodb.ObjectId.isValid(id)) {
      return connect.writeJson({
        code : 400,
        msg : `invalid comment id : ${String(item)}`
      })
    }
    if (ids.indexOf(id) === -1) {
      ids.push(id)
    }
  }

  const { collection, client } = await getDbCollection('comments')
  const result = await collection.deleteMany({
    _id : {
      $in : ids.map(id => generateDbObjectId(id))
    }
  })
  client.close()

  connect.writeJson({
    code : 200,
    requested : ids.length,
    deleted : result.deletedCount
  })
  // 清除所有评论缓存
  app.cache.clear('comment')
}
