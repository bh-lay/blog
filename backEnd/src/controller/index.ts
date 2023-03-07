// author bh-lay
import { routeItemMatched, Connect, App } from '@/core/index'

export default async function (route: routeItemMatched, connect: Connect, app: App){
	// 缓存机制
	const html = await app.cache.getWithCreate('index_page',['html'], async function(){
		// 获取视图
		return await connect.views('multi-page/indexPage',{
			title : '小剧客栈_剧中人的个人博客 网页设计师博客 前端工程师 互动设计学习者',
			keywords : '剧中人,小剧客栈,前端工程师,设计师,nodeJS',
			description : '小剧客栈是剧中人在成长路上的一个缩影，也希望借此结交更多前辈好友。分享小剧在前端、nodeJS、设计和web的各个细节上的点点滴滴，愿与你共同分享，一起进步！'
		})
	})
	connect.writeHTML(200, html)
}
