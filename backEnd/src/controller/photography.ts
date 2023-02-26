/**
 * @author bh-lay
 */
import { routeItemMatched, Connect, App } from '@/core/types'
import { getTuchongData } from '@/functions/my-tuchong-data'

export async function list (route: routeItemMatched, connect: Connect, app: App){
	const html = await app.cache.getWithCreate('photography_list',['html','photography'], async function(){
		const data = await getTuchongData()
		// 获取视图
		return await connect.views('multi-page/photographyList',{
			title : '小剧的摄影作品_小剧客栈_剧中人的个人博客',
			keywords : '摄影,剧中人,小剧客栈,前端工程师,设计师,nodeJS',
			description : '剧中人摄影的作品，汇集单反、无人机航拍、手机等多种拍摄方式！',
			list : data.post_list
		})
	})
	connect.writeHTML(200, html)
}
