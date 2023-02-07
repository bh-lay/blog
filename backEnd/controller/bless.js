/*
 * @author bh-lay
 * view url : /blog    /blog/
 */


var utils = require('../core/utils/index.js')
var DB = require('../core/DB.js')
let showdown  = require('showdown')

function getList(app, param, callback) {
	param = param || {}
	var skip = param.skip || 0
	var limit = param.limit || 10
	var findKeys = {}

	DB.getCollection('comments')
		.then(({ collection, client }) => {
			collection.countDocuments(findKeys, function (err, count) {
				collection.find(findKeys, {
					limit: limit
				}).sort({
					time: -1
				}).skip(skip).toArray(function (err, docs) {
					client.close()
					for (var i in docs) {
						docs[i].time_show = utils.parse.time(docs[i].time, '{y}年-{m}月-{d}日')
					}
					callback && callback(null, docs, {
						count: count,
						skip: skip,
						limit: limit
					})
				})
			})
		}).catch(err => {
			callback && callback(err)
		})
}
exports.list = function (route, connect, app) {

	var data = connect.url.search,
		page = data.page || 1,
		tag = data.tag ? data.tag : null

	var cache_name = 'bless_list_' + page + '_' + (tag ? tag : '')
	app.cache.use(cache_name, ['html', 'article'], function (this_cache) {
		// do something with this_cache
		connect.write('html', 200, this_cache)
	}, function (save_cache) {
		// if none of cache,do this Fn
		getList(app, {
			skip: (page - 1) * 10,
			limit: 15,
			tag: tag
		}, function (err, list, data) {
			if (err) {
				app.views('system/mongoFail', {}, function (err, html) {
					connect.write('html', 500, html)
				})
				return
			}
			var page_html = app.utils.pagination({
				list_count: data.count,
				page_list_num: data.limit,
				page_cur: page,
				max_page_btn: 10,
				base_url: '/bless?page={num}' + (tag ? ('&tag=' + tag) : '')
			})
			// 获取视图
			app.views('multi-page/bless', {
				title: (tag ? ('【' + tag + '】标签') : '我的博客') + '_小剧客栈_剧中人的个人博客',
				keywords: '博客,文章,心得,剧中人,小剧客栈,前端工程师,设计师,nodeJS',
				description: '剧中人的文笔很差，却也喜欢时常写点东西，不管是技术上的分享，生活上的感悟，还是天马行空的乱弹，小剧都会写在这里！',
				list: list,
				pagination: page_html,
				tag: tag || ''
			}, function (err, html) {
				if (err) {
					connect.write('html', 200, '<h1>页面挂了！</h1>')
				} else {
					save_cache(html)
				}
			})
		})
	})
}
