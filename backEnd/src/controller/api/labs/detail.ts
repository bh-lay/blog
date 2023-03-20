/*
 * @author bh-lay
 */

import DB from '@/database/DB'
import { routeItemMatched, Connect, App } from '@/core/index'

async function getDetail (articleID: string, format: string) {
  const resJSON: Record<string, any> = {
    code: 200,
    id : articleID,
    format : format,
    msg: '',
    detail: null,
  }
  const {collection, client} = await DB.getCollection('labs')

  const docs = await collection.find({
    id: articleID
  }).toArray()
  client.close()
  if (!docs || docs.length === 0) {
    resJSON.code = 2
    resJSON.msg = 'could not find this blog !'
  } else {
    resJSON.detail = docs[0]
  }
  return resJSON


}
export default async function (route: routeItemMatched, connect: Connect, app: App) {
  const url = connect.request.url || ''
  const cacheContent = await app.cache.getWithCreate(url, ['api','labs'], async function () {
    const data = connect.url.search
    const id = route.params.id as string
    // 内容格式 html/markdown
    const format = data.format as string || 'markdown'
    return await getDetail(id, format)
  })
  connect.writeJson(JSON.parse(cacheContent))
}
