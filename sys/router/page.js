// 引入app框架
let isbot = require('node-isbot')

var singlePage = require('../controller/singlePage.js')

// 首页
var index = require('../controller/index.js')
// 博客
var blog = require('../controller/blog.js')
// 实验室
var labs = require('../controller/labs.js')
var pano = require('../controller/pano.js')
var photography = require('../controller/photography.js')
/**
 * 选择静态、动态视图版本
 *
 */
const adaptionViewForSinglePage = controller => {
	return (route, connect, app) => {
		var isBotRequest = isbot(connect.request.headers['user-agent'])
		var isMarkJSVersion = connect.cookie('ui_version') === 'js'
		// 不是爬虫，并且 cookie 中已经标记使用单页版本
		if (!isBotRequest && isMarkJSVersion) {
			singlePage.render(connect,app)
		} else {
			// 无 cookie 标识，执行回调默认视图
			controller(route, connect, app)
		}

	}
}
module.exports = [
	// 首页
	{
		path: 'get /',
		controller: adaptionViewForSinglePage(index.get)
	},
	{
		path: 'get /blog',
		controller: adaptionViewForSinglePage(blog.list)
	},
	{
		path: 'get /blog/:id',
		controller: adaptionViewForSinglePage(blog.detail)
	},
	{
		path: 'get /labs',
		controller: adaptionViewForSinglePage(labs.list)
	},
	{
		path: 'get /720',
		controller: adaptionViewForSinglePage(pano.list)
	},
	{
		path: 'get /photography',
		controller: adaptionViewForSinglePage(photography.list)
	},
	// 留言
	{
		path: 'get /bless',
		controller: adaptionViewForSinglePage((route, connect) => {
			connect.write('define',307,{
				location:'/'
			})
		})
	},
	{
		path: 'get /labs/:name',
		controller: labs.detail
	},
	{
		path: 'get /labs/:name',
		controller: labs.detail
	}
]