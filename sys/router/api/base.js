
let comments = require('../../controller/api/comments/index.js')
let blog = require('../../controller/api/blog/index.js')

// 实验室
let labs = require('../../controller/api/labs/index.js')
/**
 * ajax
 *
 */
var user = require('../../controller/api/user/index')
let demo = require('../../controller/api/demo/index')
let functions =  require('../../controller/api/functions.js')

// 清除缓存
let clear_cache = require('../../controller/api/clear_cache')
// 获取全景图数据
let pano = require('../../controller/api/pano_get.js')
// 获取图虫数据
let photography = require('../../controller/api/photography_get.js')
let getSinglePageSideData = require('../../controller/api/single-page-side/index.js')


module.exports = [
	// 评论
	{
		path: 'get /api/comments/',
		controller: comments.list
	},
	{
		path: 'rest /api/comments/:id',
		controller: comments
	},
	// 博文
	{
		path: 'get /api/blog',
		controller: blog.list
	},
	{
		path: 'rest /api/blog/:id',
		controller: blog
	},
	{
		path: 'get /api/blogtag/',
		controller: blog.tagList
	},
	// 实验室
	{
		path: 'get /api/labs',
		controller: labs.list
	},
	{
		path: 'rest /api/labs/:id',
		controller: labs
	},
	// 单页项目获取侧边数据
	{
		path: 'get /api/single-page-side',
		controller: getSinglePageSideData
	},
	// 清除缓存
	{
		path: 'all /ajax/clear_cache',
		controller: clear_cache.render
	},
	// 前端演示用的demo
	{
		path: 'all /ajax/demo/upload',
		controller: demo.upload
	},
	
	{
		path: 'all /ajax/user/:act',
		controller(route, connect, app) {
			var act = route.params.act
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
		path: 'post /api/functions/:act',
		controller: functions
	},
	{
		path: 'all /ajax/pano/list',
		controller(route, connect, app) {
			pano.render( connect, app )
		}
	},
	{
		path: 'all /ajax/photography/list',
		controller: photography.render
	}
]