/**
 * @author bh-lay
 */
import { routeItemMatched, Connect, App } from '@/core/index'
import { formatTime } from '@/lib/utils'
import { getDbCollection } from '@/database/DB'
// TODO: replace to other package
const showdown  = require('showdown')

async function list_page (app: App) {
  const { collection, client } = await getDbCollection('labs')
  const docs = await collection.find({}, { limit: 15 }).sort({ id: -1 }).toArray()
  for (const i in docs) {
    docs[i].cover = (docs[i].cover && docs[i].cover[0] == '/') ? app.options.frontendCdnDomain + docs[i].cover : docs[i].cover
  }
  client.close()
  return docs

}

export function list (route: routeItemMatched, connect: Connect, app: App) {
  return app.cache.getWithCreate('labs_list', ['html', 'labs'], function () {
    return list_page(app)
      .then(function (list) {
        // 获取视图
        return connect.views('multi-page/labsList', {
          title: '实验室_小剧客栈_剧中人的个人博客',
          keywords: '造轮子,组件,实验室,剧中人,小剧客栈,前端工程师,设计师,nodeJS',
          description: '剧中人造轮子的基地，汇集小剧开发的部分组件，孕育优秀代码的实验室！',
          list: list
        })
      })
  })
    .then((html) => {
      connect.writeHTML(200, html)
    })
}

async function get_detail (lab_name: string) {
  // get template
  const { collection, client } = await getDbCollection('labs')
  const docs = await collection.find({ 'name': lab_name }).toArray()

  client.close()
  const converter = new showdown.Converter()
  if (!docs || docs.length === 0) {
    throw new Error('notFound')
  }
  const doc = docs[0]
  doc.time_show = formatTime(doc.time_create, '{y}-{m}-{d}')
  doc.content = converter.makeHtml(doc.content)
  return doc
}

export async function detail (route: routeItemMatched, connect: Connect, app: App) {
  const lab_name = route.params.name as string
  const html = await app.cache.getWithCreate('labs_id_' + lab_name, ['html', 'labs'], async function () {
    // 获取作品信息
    const data = await get_detail(lab_name)
    // 获取视图
    return connect.views('multi-page/labsDetail', {
      title: data.title,
      keywords: data.tags,
      description: data.intro,
      content: data.content,
      git_full_name: data.git_full_name,
      demo_url: data.demo_url
    })
  })
  connect.writeHTML(200, html)
}