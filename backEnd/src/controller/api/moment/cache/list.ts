
/*
 * @author bh-lay
 */
import { routeItemMatched, Connect } from '@/core/index'
import { getDocsByPagination } from '@/database/DB'

export default async function (route: routeItemMatched, connect: Connect) {
  const data = connect.url.search

  const limit_num = parseInt(data.limit as string) || 10
  const skip_num = parseInt(data.skip as string) || 0
  const params = {}

  // 按照分页获取数据
  const {count, docs} = await getDocsByPagination('moment_cache', {
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
    list: docs
  })
}