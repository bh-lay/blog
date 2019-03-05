
//用户登录认证
let snsLogin = require('../controller/snsLogin.js')
/**
 * ajax
 *
 */
var ajax_user = require('../ajax/user/index')
let ajax_add_edit = require('../ajax/add&edit.js')
let ajax_comments = require('../ajax/comments/index.js')
let ajax_links = require('../ajax/links/index.js')
let ajax_del = require('../ajax/del')
let ajax_demo = require('../ajax/demo/index')
let ajax_tag =  require('../ajax/tag/index.js')
let ajax_functions =  require('../ajax/functions.js')


//实验室
let ajax_labs = require('../ajax/labs_get')
let ajax_labs_update = require('../ajax/labs/updateGitInfo')
//清除缓存
let ajax_clear_cache = require('../ajax/clear_cache')
// 获取全景图数据
let ajax_pano = require('../ajax/pano_get.js')
// 获取图虫数据
let ajax_photography = require('../ajax/photography_get.js')
//博客
let ajax_blog = require('../ajax/article_get')


module.exports = [
	//通用增加&编辑
	{
		path: 'all /ajax/add_edit',
		controller: ajax_add_edit.render
	},
	{
		path: 'all /ajax/blog',
		controller: ajax_blog.render
	},
	{
		path: 'all /ajax/labs',
		controller:ajax_labs.render
	},
	{
		path: 'all /ajax/labs/updateGitInfo',
		controller: ajax_labs_update.render
	},
	//友情链接
	{
		path: 'all /ajax/links/list',
		controller: ajax_links.list
	},
	{
		path: 'all /ajax/links/detail/:id',
		controller: ajax_links.detail
	},
	{
		path: 'all /ajax/links/add_edit',
		controller: ajax_links.add_edit
	},
	{
		path: 'all /ajax/links/post',
		controller: ajax_links.post
	},
	// 清除缓存
	{
		path: 'all /ajax/clear_cache',
		controller: ajax_clear_cache.render
	},
	// 前端演示用的demo
	{
		path: 'all /ajax/demo/*',
		controller(route, connect, app) {
			ajax_demo.render(connect,app)
		}
	},
	// 公用删除接口
	{
		path: 'all /ajax/del',
		controller(route, connect, app) {
			ajax_del.render(connect,app)
		}
	},
	// 评论
	{
		path: 'all /ajax/comments/:mark',
		controller(route, connect, app) {
			var mark = route.param.mark
			//尝试使用ajax模块提供接口
			if(ajax_comments[mark]){
				ajax_comments[mark](connect,app)
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
			//尝试使用ajax模块提供接口
			if(ajax_tag[act]){
				ajax_tag[act](connect,app)
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
			//尝试使用ajax模块提供接口
			if(ajax_user[act]){
				ajax_user[act](connect,app)
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
			ajax_functions(connect,app,act)
		}
	},
	{
		path: 'all /ajax/pano/list',
		controller(route, connect, app) {
			ajax_pano.render( connect, app )
		}
	},
	{
		path: 'all /ajax/photography/list',
		controller(route, connect, app) {
			ajax_photography.render(connect, app)
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
]