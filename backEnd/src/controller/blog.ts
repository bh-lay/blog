/*
 * @author bh-lay
 * view url : /blog    /blog/
 */
import { routeItemMatched, Connect, App } from '@/core/index'
import { createPagination } from '@/lib/pagination'
import { formatTime } from '@/core/utils/parse'
import DB from '@/database/DB'

const showdown  = require('showdown')

type getListParams = {
	skip: number,
	limit: number,
	tag: null | string
}
async function getList (app: App, param: getListParams) {
	param = param || {}
	const skip = param.skip || 0
	const limit = param.limit || 10
	const findKeys: {tags?: string} = {}
	// 过滤标签
	if (param.tag) {
		findKeys.tags = param.tag
	}
	const { collection, client } = await DB.getCollection('article')
	const count = await collection.countDocuments(findKeys)

	const docs = await collection.find(findKeys, {
		limit: limit
	}).sort({
		time_show: -1
	}).skip(skip).toArray()
	client.close()

	for (const i in docs) {
		docs[i].time_show = formatTime(docs[i].time_show, '{y}年-{m}月-{d}日')
		docs[i].cover = (docs[i].cover && docs[i].cover[0] == '/') ? app.options.frontendCdnDomain + docs[i].cover : docs[i].cover
	}
	return {
		docs,
		count,
		limit
	}
}
export async function list(route: routeItemMatched, connect: Connect, app: App) {
	const data = connect.url.search
	const page: number = parseInt(data.page as string, 10) || 1
	const tag = typeof data.tag === 'string' ? data.tag : null

	const cache_name = 'blog_list_' + page + '_' + (tag ? tag : '')
	const html = await app.cache.getWithCreate(cache_name, ['html', 'article'], async function () {
		// if none of cache,do this Fn
		const params: getListParams = {
			skip: (page - 1) * 10,
			limit: 10,
			tag: tag
		}
		const {docs, count, limit} = await getList(app, params)

		const page_html = createPagination({
			list_count: count,
			page_list_num: limit,
			page_cur: page,
			max_page_btn: 10,
			base_url: '/blog?page={num}' + (tag ? ('&tag=' + tag) : '')
		})
		// 获取视图
		return await connect.views('multi-page/blogList', {
			title: (tag ? ('【' + tag + '】标签') : '我的博客') + '_小剧客栈_剧中人的个人博客',
			keywords: '博客,文章,心得,剧中人,小剧客栈,前端工程师,设计师,nodeJS',
			description: '剧中人的文笔很差，却也喜欢时常写点东西，不管是技术上的分享，生活上的感悟，还是天马行空的乱弹，小剧都会写在这里！',
			list: docs,
			pagination: page_html,
			tag: tag || ''
		})
	})
	connect.writeHTML(200, html)
}

async function getDetail(id: string) {
	const { collection, client } = await DB.getCollection('article')
	const docs = await collection.find({
		'id': id
	}).toArray()
	client.close()

	if (!docs || docs.length === 0) {
		throw new Error('哇塞，貌似这篇博文不存在哦!')
	}
	const doc = docs[0]
	doc.time_show = formatTime(doc.time_show, '{y}-{mm}-{d}')

	const converter = new showdown.Converter()
	doc.content = converter.makeHtml(doc.content)
	return doc
}
export async function detail (route: routeItemMatched, connect: Connect, app: App) {
	const id = route.params.id as string
	const html = await app.cache.getWithCreate('blog_id_' + id, ['html', 'article'], async function() {
		const data = await getDetail(id)
		// 获取视图
		return await connect.views('multi-page/blogDetail', {
			id: id,
			title: data.title,
			keywords: data.tags,
			description: data.intro,
			time_show: data.time_show,
			author: data.author || '剧中人',
			cover: data.cover,
			tags: data.tags,
			content: data.content
		})
	})
	connect.writeHTML(200, html)
}
