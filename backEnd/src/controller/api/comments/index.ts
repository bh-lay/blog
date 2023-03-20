/**
 * @author bh-lay
 * 
 */
import { routeItemMatched, Connect, App } from '@/core/index'
import addComments from './add'
import getList from './list'
import getDetail from './detail'
import update from './update'
import remove from './remove'


// 获取列表
export async function list (route: routeItemMatched, connect: Connect, app: App) {
  const url = connect.request.url || ''
  const params = connect.url.search

  // 使用缓存
  const cacheJson = await app.cache.getWithCreate(url, ['api','comment'], async function () {
    const jsonData = await getList(connect, {
      limit: parseInt(params.limit as string),
      skip: parseInt(params.skip as string),
      isadmin: !!params.isadmin,
      cid: params.cid as string
    })
    return {
      code : 200,
      data: jsonData
    }
  })
  connect.writeJson(JSON.parse(cacheJson))
}

export default {
  post: addComments,
  get: getDetail,
  delete: remove,
  put: update
}