
/*
 * @author bh-lay
 */

import { routeItemMatched, Connect, App } from '@/core/index'
import DB from '@/database/DB'
type listOption = {
	limit?: number
	skip?: number
}
async function getList (data: listOption) {
  const limit_num = data.limit || 10
  const skip_num = data.skip || 0
  const params = {}

  // 按照分页获取数据
  const { count, docs } = await DB.getDocsForPagination('labs', {
    params,
    limit: limit_num,
    skip: skip_num,
    sort: {
      time_create: -1
    }
  })
  // 删除正文
  for (const i in docs) {
    delete docs[i]['content']
  }
  return {
    code: 1,
    limit: limit_num,
    skip: skip_num,
    count,
    list: docs
  }
}


export default async function (route: routeItemMatched, connect: Connect, app: App) {
  const url = connect.request.url || ''
  const cacheContent = await app.cache.getWithCreate(url, ['api','labs'], async function () {
    const data = connect.url.search
    return await getList({
      limit: parseInt(data.limit as string) || 10,
      skip: parseInt(data.skip as string, 10)
    })
  })
  connect.writeJson(JSON.parse(cacheContent))
}