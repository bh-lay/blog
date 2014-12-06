
global.CONFIG = require('./conf/app_config');

//引入app框架
var app_factory = require('../sys/core/index.js');
//创建app
var app = new app_factory(CONFIG.port);

app.set('staticFileRoot','../web/')


/**
 * 选择静态、动态视图版本
 *
 */
function views_select(connect,callback){
	//cookie有相应字段
	if(connect.cookie('ui_version') == 'js'){
		//读取缓存
		app.cache.html('singlePage',function(this_cache){
			connect.write('html',200,this_cache);
		},function(save_cache){
			//获取单页面视图
			app.views('singlePage',{
				'title' : '我的博客',
				'keywords' : '剧中人,bh-lay,网站建设,网页设计,设计师',
				'description' : '小剧客栈是剧中人精心营造的一个向广大设计爱好者、喜欢剧中人开放的博客，小剧希望用设计师鞭策自己，愿意和你共同分享，一起进步！'
			},function(err,html){
				save_cache(html);
			});
		});
	}else{
		//无cookie标识，执行回调默认视图
		callback && callback();
	}
}

//首页
var index = require('./controller/index.js');
app.get('/', function(data,connect){
	views_select(connect,function(){
		index.deal(connect,app);
	});
});
//留言
app.get('/bless', function(data,connect){
	views_select(connect,function(){
		connect.write('define',307,{
			location:'/'
 		});
	});
});

//博客
var blog = require('./controller/blog.js');
app.get('/blog', function(data,connect){
	views_select(connect,function(){
		blog.list(connect,app);
	});
});
app.get('/blog/{id}', function(data,connect){
	views_select(connect,function(){
		blog.detail(connect,app,data.id);
	});
});


//实验室
var labs = require('./controller/labs.js');
app.get('/labs', function(data,connect){
	views_select(connect,function(){
		labs.list(connect,app);
	});
});
app.get('/labs/{name}', function(data,connect){
	labs.detail(connect,app,data.name);
});

//作品
var opus = require('./controller/opus.js');
app.get('/opus', function(data,connect){
	views_select(connect,function(){
		opus.list(connect,app);
	});
});
app.get('/opus/{id}', function(data,connect){
	views_select(connect,function(){
		opus.detail(connect,app,data.id);
	});
});

//后台
var admin = require('./controller/admin.js');
app.get('/admin/*', function(data,connect){
	admin.render(connect,app);
});

//用户认证
var snsLogin = require('./controller/snsLogin.js');
app.get('/snsLogin/{from}', function(data,connect){
	if(data.from == 'github'){
		snsLogin.github(connect,app);
	}else{
		connect.write('json',{
			'code' : 500
		});
	}
});

/**
 * ajax
 *
 */
 
//通用增加&编辑
var ajax_add_edit = require('./ajax/add&edit.js');
app.get('/ajax/add_edit', function(data,connect){
	ajax_add_edit.render(connect,app);
});

//博客
var ajax_blog = require('./ajax/article_get');
app.get('/ajax/blog', function(data,connect){
	ajax_blog.render(connect,app);
});
//分享
var ajax_share = require('./ajax/share_get');
app.get('/ajax/share', function(data,connect){
	ajax_share.render(connect,app);
});
//实验室
var ajax_labs = require('./ajax/labs_get');
app.get('/ajax/labs', function(data,connect){
	ajax_labs.render(connect,app);
});
//作品
var ajax_opus = require('./ajax/opus_get');
app.get('/ajax/opus', function(data,connect){
	ajax_opus.render(connect,app);
});

//友情链接
var ajax_friends = require('./ajax/friends_get');
app.get('/ajax/friends', function(data,connect){
	ajax_friends.render(connect,app);
});

//清除缓存
var ajax_clear_cache = require('./ajax/clear_cache');
app.get('/ajax/clear_cache', function(data,connect){
	ajax_clear_cache.render(connect,app);
});

//图库
var ajax_asset = require('./ajax/asset/index');
app.get('/ajax/asset/*', function(data,connect){
	ajax_asset.render(connect,app);
});

//前端演示用的demo
var ajax_demo = require('./ajax/demo/index');
app.get('/ajax/demo/*', function(data,connect){
	ajax_demo.render(connect,app);
});

//权限
var ajax_power = require('./ajax/user/power');
app.get('/ajax/power', function(data,connect){
	connect.write('json',{
		'code' : 500
	})
//	ajax_power.render(connect,app);
});

//用户组
var ajax_user_group = require('./ajax/user/user_group_add&edit');
app.get('/ajax/user_group', function(data,connect){
	connect.write('json',{
		'code' : 500
	})
//	ajax_user_group.render(connect,app);
});

//公用删除接口
var ajax_del = require('./ajax/del');
app.get('/ajax/del', function(data,connect){
	ajax_del.render(connect,app);
});

//评论
var ajax_comments = require('./ajax/comments/index.js');
app.get('/ajax/comments/add', function(data,connect){
	ajax_comments.add(connect,app);	
});
app.get('/ajax/comments/list', function(data,connect){
	ajax_comments.list(connect,app);	
});
app.get('/ajax/comments/del', function(data,connect){
	ajax_comments.del(connect,app);
});

//用户
var ajax_user = require('./ajax/user/index');
app.get('/ajax/user/{mark}', function(data,connect){
	switch(data.mark){
		case 'add_edit':
			ajax_user.add_edit(connect,app);
		break
		case 'signup':
			ajax_user.signup(connect,app);
		break
		case 'login':
			ajax_user.login(connect,app);
		break
		case 'exist':
			ajax_user.exist(connect,app);
		break
		case 'list':
			ajax_user.list(connect,app);
		break
		case 'detail':
			ajax_user.detail(connect,app);
		break
		default :
			connect.write('json',{
				'code' : 500
			});
			
	}
});