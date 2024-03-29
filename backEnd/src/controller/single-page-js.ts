import { routeItemMatched, Connect, App } from '@/core/index'

export default async function (route: routeItemMatched, connect: Connect, app: App) {
  // 缓存机制
  const html = await app.cache.getWithCreate('singlePage',['html','comment'], async function () {
    // 获取单页面视图
    return await connect.views('single-page/index',{
      title : '我的博客_小剧客栈_剧中人的个人博客',
      keywords : '剧中人,小剧客栈,bh_lay,前端工程师,设计师,nodeJS',
      description : '小剧客栈是剧中人在成长路上的一个缩影，也希望借此结交更多前辈好友。分享小剧在前端、nodeJS、设计和web的各个细节上的点点滴滴，愿与你共同分享，一起进步！'
    })
  })
  connect.writeHTML(200, html)
}