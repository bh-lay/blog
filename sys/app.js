//引入app框架
var app_factory = require('../sys/core/index.js'),
	CronJob = require('cron').CronJob,
	isbot = require('node-isbot')

//创建app
var app = new app_factory()

/**
 * 选择静态、动态视图版本
 *
 */
var singlePage = require('./controller/singlePage.js')
function views_select(connect,callback){
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
var index = require('./controller/index.js')
//前端英雄榜
var links = require('./controller/links.js')
//博客
var blog = require('./controller/blog.js')

//实验室
var labs = require('./controller/labs.js')
var pano = require('./controller/pano.js')
var photography = require('./controller/photography.js')
var admin = require('./controller/admin.js')

const routes = [
	// 首页
	{
		path: 'get /',
		controller(route, connect, app) {
			views_select(connect,function(){
				index.get(route, connect,app)
			})
		}
	},
	// 留言
	{
		path: 'get /bless',
		controller(route, connect) {
			views_select(connect,function(){
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
			views_select(connect,function(){
				blog.list(connect,app)
			})
		}
	},
	{
		path: 'get /blog/:id',
		controller(route, connect, app) {
			views_select(connect,function(){
				blog.detail(connect, app, route.param.id)
			})
		}
	},
	{
		path: 'get /labs',
		controller(route, connect, app) {
			views_select(connect,function(){
				labs.list(connect,app)
			})
		}
	},
	{
		path: 'get /720',
		controller(route, connect, app) {
			views_select(connect,function(){
				pano.list(connect, app)
			})
		}
	},
	{
		path: 'get /photography',
		controller(route, connect, app) {
			views_select(connect,function(){
				photography.list(connect, app)
			})
		}
	},
	{
		path: 'get /labs/:name',
		controller(route, connect, app) {
			views_select(connect,function(){
				labs.detail(connect, app, route.param.name)
			})
		}
	},
	//后台
	{
		path: 'get /admin/*',
		controller(route, connect, app) {
			admin.render(connect,app)
		}
	},
]
routes.forEach(({path, controller}) => {
	app.setRoute(path, controller)
})




//用户登录认证
var snsLogin = require('./controller/snsLogin.js')
app.setRoute('/snsLogin/:from', function(route, connect, app) {
	if(route.param.from == 'github'){
		snsLogin.github(connect,app)
	}else{
		connect.write('json',{
			'code' : 500
		})
	}
})


//验证码
var verifycode = require('./controller/verifycode.js')
app.setRoute('/verifycode', function(route, connect, app) {
	verifycode.render(connect,app)
})

/**
 * ajax
 *
 */
var ajax_user = require('./ajax/user/index'),
	ajax_add_edit = require('./ajax/add&edit.js'),
	ajax_comments = require('./ajax/comments/index.js'),
	ajax_links = require('./ajax/links/index.js'),
	ajax_del = require('./ajax/del'),
	ajax_demo = require('./ajax/demo/index'),
	ajax_tag =  require('./ajax/tag/index.js'),
	ajax_functions =  require('./ajax/functions.js')

//通用增加&编辑
app.setRoute('/ajax/add_edit', function(route, connect, app) {
	ajax_add_edit.render(connect,app)
})

//博客
var ajax_blog = require('./ajax/article_get')
app.setRoute('/ajax/blog', function(route, connect, app) {
	ajax_blog.render(connect,app)
})
//实验室
var ajax_labs = require('./ajax/labs_get'),
	ajax_labs_update = require('./ajax/labs/updateGitInfo')
app.setRoute('/ajax/labs', function(route, connect, app) {
	ajax_labs.render(connect,app)
})
app.setRoute('/ajax/labs/updateGitInfo', function(route, connect, app) {
	ajax_labs_update.render(connect,app)
})

//友情链接
app.setRoute('/ajax/links/list', function(route, connect, app) {
	ajax_links.list(connect,app)
})
app.setRoute('/ajax/links/detail/:id', function(route, connect, app) {
	ajax_links.detail(connect,app, route.param.id)
})
app.setRoute('/ajax/links/add_edit', function(route, connect, app) {
	ajax_links.add_edit(connect,app, route.param.id)
})
app.setRoute('/ajax/links/post', function(route, connect, app) {
	ajax_links.post(connect,app, route.param.id)
})

//清除缓存
var ajax_clear_cache = require('./ajax/clear_cache')
app.setRoute('/ajax/clear_cache', function(route, connect, app) {
	ajax_clear_cache.render(connect,app)
})

//图库
var ajax_asset = require('./ajax/asset/index')
app.setRoute('/ajax/asset/*', function(route, connect, app) {
	ajax_asset.render(connect,app)
})

//前端演示用的demo
app.setRoute('/ajax/demo/*', function(route, connect, app) {
	ajax_demo.render(connect,app)
})

//公用删除接口
app.setRoute('/ajax/del', function(route, connect, app) {
	ajax_del.render(connect,app)
})

//评论
app.setRoute('/ajax/comments/:mark', function(route, connect, app) {
	var mark = route.param.mark
	//尝试使用ajax模块提供接口
	if(ajax_comments[mark]){
		ajax_comments[mark](connect,app)
	}else{
		connect.write('json',{
			'code' : 404
		})
	}
})

//标签模块
app.setRoute('/ajax/tag/:act', function(route, connect, app) {
	var act = route.param.act
	//尝试使用ajax模块提供接口
	if(ajax_tag[act]){
		ajax_tag[act](connect,app)
	}else{
		connect.write('json',{
			'code' : 500
		})
	}
})

//用户
app.setRoute('/ajax/user/:act', function(route, connect, app) {
	var act = route.param.act
	//尝试使用ajax模块提供接口
	if(ajax_user[act]){
		ajax_user[act](connect,app)
	}else{
		connect.write('json',{
			'code' : 500
		})
	}
})

app.setRoute('/ajax/functions/:act',function(route, connect, app) {
	var act = route.param.act
	ajax_functions(connect,app,act)
})

// 获取全景图数据
var ajax_pano = require('./ajax/pano_get.js')
app.setRoute('/ajax/pano/list', function( data, connect ){
	ajax_pano.render( connect, app )
})
// 获取图虫数据
var ajax_photography = require('./ajax/photography_get.js')
app.setRoute('/ajax/photography/list', function( data, connect ){
	ajax_photography.render(connect, app)
})


/**
 * 计划任务
 **/
var updateLabsDataFromGithub = require('../sys/functions/updateLabsDataFromGithub.js'),
	updateFriendsScore = require('../sys/functions/updateFriendsScore.js'),
	my720Data = require('../sys/functions/my720Data.js'),
	myTuchongData = require('../sys/functions/myTuchongData.js'),
	myGithubData = require('../sys/functions/myGithubData.js')
//每晚三点
new CronJob('01 01 03 * * *', function() {
	//更新实验室里的Github数据
	updateLabsDataFromGithub.all()
	//更新个人Github信息
	myGithubData.update()
	// 更新前端英雄榜分数
	updateFriendsScore.update()
	// 更新720云数据
	my720Data.update()
	// 更新图虫数据
	myTuchongData.update()
}, null, true, 'Asia/Hong_Kong')

//每晚三点零十分
new CronJob('01 10 03 * * *', function() {
	//清除缓存
	app.cache.clear()
}, null, true, 'Asia/Hong_Kong')