/*
 * @author bh-lay
 */
import { routeItemMatched, Connect } from '@/core/index'
import DB from '@/database/DB'

const collectionName = 'moment_post'

const showdown  = require('showdown')


export default async function (route: routeItemMatched, connect: Connect) {
  const data = connect.url.search
  const postId = route.params.id
  // 内容格式 html/markdown
  const format = data.format || 'markdown'

  const resJSON={
    code: 200,
    id: postId,
    detail: null,
    format : format
  }
  const {collection, client} = await DB.getCollection(collectionName)

  const docs = await collection.find({
    id: postId
  }).toArray()

  client.close()
  if (!docs || docs.length === 0) {
    return connect.writeJson({
      code: 2,
      msg: 'could not find this blog !'
    })
  }
  const detail = docs[0]
  if (format == 'html') {
    const converter = new showdown.Converter()
    converter.setOption('noHeaderId', true)
    detail.content = converter.makeHtml(detail.content)
  }
  return connect.writeJson({
    code: 200,
    detail
  })
		
}