
// 用户登录认证
let snsLogin = require('../controller/snsLogin.js')
/**
 * ajax
 *
 */
var user = require('../controller/api/user/index')
let add_edit = require('../controller/api/add&edit.js')
let comments = require('../controller/api/comments/index.js')
let links = require('../controller/api/links/index.js')
let del = require('../controller/api/del')
let demo = require('../controller/api/demo/index')
let tag =  require('../controller/api/tag/index.js')
let functions =  require('../controller/api/functions.js')


// 实验室
let labs = require('../controller/api/labs_get')
let labs_update = require('../controller/api/labs/updateGitInfo')
// 清除缓存
let clear_cache = require('../controller/api/clear_cache')
// 获取全景图数据
let pano = require('../controller/api/pano_get.js')
// 获取图虫数据
let photography = require('../controller/api/photography_get.js')
// 博客
let blog = require('../controller/api/article_get')

let imgRobber =  require('../controller/img-robber/index.js')

module.exports = [
	// 通用增加&编辑
	{
		path: 'all /ajax/add_edit',
		controller: add_edit.render
	},
	{
		path: 'all /ajax/blog',
		controller: blog.render
	},
	{
		path: 'all /ajax/labs',
		controller:labs.render
	},
	{
		path: 'all /ajax/labs/updateGitInfo',
		controller: labs_update.render
	},
	// 友情链接
	{
		path: 'all /ajax/links/list',
		controller: links.list
	},
	{
		path: 'all /ajax/links/detail/:id',
		controller: links.detail
	},
	{
		path: 'all /ajax/links/add_edit',
		controller: links.add_edit
	},
	{
		path: 'all /ajax/links/post',
		controller: links.post
	},
	// 清除缓存
	{
		path: 'all /ajax/clear_cache',
		controller: clear_cache.render
	},
	// 前端演示用的demo
	{
		path: 'all /ajax/demo/*',
		controller(route, connect, app) {
			demo.render(connect,app)
		}
	},
	// 公用删除接口
	{
		path: 'all /ajax/del',
		controller(route, connect, app) {
			del.render(connect,app)
		}
	},
	// 评论
	{
		path: 'all /ajax/comments/:mark',
		controller(route, connect, app) {
			var mark = route.param.mark
			// 尝试使用ajax模块提供接口
			if(comments[mark]){
				comments[mark](connect,app)
			}else{
				connect.write('json',{
					'code' : 404
				})
			}
		}
	},
	// 标签模块
	{
		path: 'all /ajax/tag/:act',
		controller(route, connect, app) {
			var act = route.param.act
			// 尝试使用ajax模块提供接口
			if(tag[act]){
				tag[act](connect,app)
			}else{
				connect.write('json',{
					'code' : 500
				})
			}
		}
	},
	{
		path: 'all /ajax/user/:act',
		controller(route, connect, app) {
			var act = route.param.act
			// 尝试使用ajax模块提供接口
			if(user[act]){
				user[act](connect,app)
			}else{
				connect.write('json',{
					'code' : 500
				})
			}
		}
	},
	{
		path: 'all /ajax/functions/:act',
		controller(route, connect, app) {
			var act = route.param.act
			functions(connect,app,act)
		}
	},
	{
		path: 'all /ajax/pano/list',
		controller(route, connect, app) {
			pano.render( connect, app )
		}
	},
	{
		path: 'all /ajax/photography/list',
		controller(route, connect, app) {
			photography.render(connect, app)
		}
	},
	// 用户登录认证
	{
		path: 'all /snsLogin/:from',
		controller(route, connect, app) {
			if(route.param.from == 'github'){
				snsLogin.github(connect,app)
			}else{
				connect.write('json',{
					'code' : 500
				})
			}
		}
	},
	// 用户登录认证
	{
		path: 'get /img-robber/:source',
		controller: imgRobber.render
	},
]