
/*
 * @author bh-lay
 */

import { routeItemMatched, Connect } from '@/core/index'
import { getDocsByPagination } from '@/database/DB'
import parseData from './parse'

const collectionName = 'friends'

export default async function (route: routeItemMatched, connect: Connect) {
  const data = connect.url.search
  const limit_num = parseInt(data.limit as string) || 10
  const skip_num = parseInt(data.skip as string) || 0

  const params: Record<string, unknown> = {}
  // 按是否展示筛选；不传参数则不过滤（展示全部）
  // 支持 true / false、1 / 0
  const isShow = data.isShow as string | undefined
  if (isShow !== undefined) {
    params.isShow = isShow === 'true' || isShow === '1'
  }

  // 按照分页获取数据
  const {count, docs} = await getDocsByPagination(collectionName, {
    params,
    limit: limit_num,
    skip: skip_num,
    sort: {
      score: -1
    }
  })

  connect.writeJson({
    code: 1,
    limit: limit_num,
    skip: skip_num,
    count,
    list: docs.map(parseData)
  })
}