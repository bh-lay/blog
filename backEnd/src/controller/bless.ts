/*
 * @author bh-lay
 * view url : /blog    /blog/
 */
import { routeItemMatched, Connect, App } from '@/core/index'
import { createPagination } from '@/lib/pagination'
import { formatTime } from '@/lib/utils'
import DB from '@/database/DB'

type getListParams = {
	skip: number,
	limit: number,
	tag: null | string
}
async function getList(app: App, param: getListParams) {
	param = param || {}
	const skip = param.skip || 0
	const limit = param.limit || 10
	const findKeys = {}

	const { collection, client } = await DB.getCollection('comments')
	const count = await collection.countDocuments(findKeys)
	const docs = await collection.find(findKeys, {
		limit: limit
	}).sort({
		time: -1
	}).skip(skip).toArray()
	client.close()
	
	for (const i in docs) {
		docs[i].time_show = formatTime(docs[i].time, '{y}年-{m}月-{d}日')
	}
	return {
		docs,
		count,
		limit
	}
}
export async function list(route: routeItemMatched, connect: Connect, app: App) {
	const data = connect.url.search,
		page = data.page || 1
	const tag = typeof data.tag === 'string' ? data.tag : null

	const cache_name = 'bless_list_' + page + '_' + (tag ? tag : '')
	const html = await app.cache.getWithCreate(cache_name, ['html', 'article'], async function () {
		// if none of cache,do this Fn
		const {docs, count, limit} = await getList(app, {
			skip: (page as number - 1) * 10,
			limit: 15,
			tag: tag
		})
		const paginationHtml = createPagination({
			list_count: count,
			page_list_num: limit,
			page_cur: page as number,
			max_page_btn: 10,
			base_url: '/bless?page={num}' + (tag ? ('&tag=' + tag) : '')
		})
		// 获取视图
		return await connect.views('multi-page/bless', {
			title: (tag ? ('【' + tag + '】标签') : '我的博客') + '_小剧客栈_剧中人的个人博客',
			keywords: '博客,文章,心得,剧中人,小剧客栈,前端工程师,设计师,nodeJS',
			description: '剧中人的文笔很差，却也喜欢时常写点东西，不管是技术上的分享，生活上的感悟，还是天马行空的乱弹，小剧都会写在这里！',
			list: docs,
			pagination: paginationHtml,
			tag: tag || ''
		})
	})
	connect.writeHTML(200, html)
}
