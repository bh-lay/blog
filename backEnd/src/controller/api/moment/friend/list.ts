
/*
 * @author bh-lay
 */

import { routeItemMatched, Connect } from '@/core/index'
import { getDocsByPagination } from '@/database/DB'
import power from '@/conf/power'

const collectionName = 'friends'

export default async function (route: routeItemMatched, connect: Connect) {
  const data = connect.url.search
  const limit_num = parseInt(data.limit as string) || 10
  const skip_num = parseInt(data.skip as string) || 0
  const params: Record<string, unknown> = {}
  const sessionInstance = await connect.session()
  if (!sessionInstance.power(power.BLOG_EDIT)) {
    params.isShow = {
      $in: [1, '1']
    }
  }

  // 过滤标签
  if (data.tag) {
    params.tags = data.tag
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
    list: docs
  })
}