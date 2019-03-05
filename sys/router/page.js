//引入app框架
let	isbot = require('node-isbot')
/**
 * 选择静态、动态视图版本
 *
 */
var singlePage = require('../controller/singlePage.js')
function views_select(connect, app, callback){
	var isBotRequest = isbot(connect.request.headers['user-agent'])
	var isMarkJSVersion = connect.cookie('ui_version') == 'js'
	// 不是爬虫，并且 cookie 中已经标记使用单页版本
	if (!isBotRequest && isMarkJSVersion) {
		singlePage.render(connect,app)
	} else {
		// 无 cookie 标识，执行回调默认视图
		callback && callback()
	}
}

//首页
var index = require('../controller/index.js')
//前端英雄榜
var links = require('../controller/links.js')
//博客
var blog = require('../controller/blog.js')
//实验室
var labs = require('../controller/labs.js')
var pano = require('../controller/pano.js')
var photography = require('../controller/photography.js')
var admin = require('../controller/admin.js')

module.exports = [
	// 首页
	{
		path: 'get /',
		controller(route, connect, app) {
			views_select(connect, app, function(){
				index.get(route, connect,app)
			})
		}
	},
	// 留言
	{
		path: 'get /bless',
		controller(route, connect, app) {
			views_select(connect, app, function(){
				connect.write('define',307,{
					location:'/'
				})
			})
		}
	},
	{
		path: 'get /directories',
		controller(route, connect, app) {
			links.render(connect,app)
		}
	},
	{
		path: 'get /blog',
		controller(route, connect, app) {
			views_select(connect, app, function(){
				blog.list(connect,app)
			})
		}
	},
	{
		path: 'get /blog/:id',
		controller(route, connect, app) {
			views_select(connect, app, function(){
				blog.detail(connect, app, route.param.id)
			})
		}
	},
	{
		path: 'get /labs',
		controller(route, connect, app) {
			views_select(connect, app, function(){
				labs.list(connect,app)
			})
		}
	},
	{
		path: 'get /720',
		controller(route, connect, app) {
			views_select(connect, app, function(){
				pano.list(connect, app)
			})
		}
	},
	{
		path: 'get /photography',
		controller(route, connect, app) {
			views_select(connect, app, function(){
				photography.list(connect, app)
			})
		}
	},
	{
		path: 'get /labs/:name',
		controller: labs.detail
	},
	//后台
	{
		path: 'get /admin/*',
		controller: admin.render
	},
]