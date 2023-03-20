/*
 * @author bh-lay
 */
import { routeItemMatched, Connect, App } from '@/core/index'
import list from './list'
import detail from './detail'
import getTagList from './get-tag-list'
import updateArticle from './update'
import publish from './publish'
import remove from './remove'

export async function getList (route: routeItemMatched, connect: Connect, app: App) {
  const url = connect.request.url || ''
  const json = await app.cache.getWithCreate(url, ['api','article'], async function () {
    const data = connect.url.search || {}
    return await list({
      limit: typeof data.limit === 'number' ? data.limit : 10,
      skip: parseInt(data.skip as string, 10),
      tag: typeof data.tag === 'string' ? data.tag : undefined
    })
  })
  connect.writeJson(JSON.parse(json))
}

async function getArticleDetail (route: routeItemMatched, connect: Connect, app: App) {
  const url = connect.request.url || ''
  const json = await app.cache.getWithCreate(url,['api','article'], async function () {
    const data = connect.url.search
    const id = route.params.id
    // 内容格式 html/markdown
    const format = data.format as string || 'markdown'
    return await detail(id as string, format)
  })
  connect.writeJson(JSON.parse(json))
}

export async function blogTagList (route: routeItemMatched, connect: Connect, app: App) {
  const cacheContent = await app.cache.getWithCreate('tagsListB',['api','article','tags'], async () => {
    const list = await getTagList()
    return {
      code: 200,
      list : list
    }
  })
  connect.writeJson(JSON.parse(cacheContent))
}

export default {
  get: getArticleDetail,
  put: updateArticle,
  post: publish,
  delete: remove
}
