
global.CONFIG = require('./conf/app_config');
//引入app框架
var app_factory = require('../sys/lofox/index.js');
//创建app
var app = new app_factory(3000);

app.set('staticFileRoot','../web/')

//首页
var index = require('./controller/index.js');
app.get('/', function(data,connect){
	index.deal(connect,app);
});

//博客
var blog = require('./controller/blog.js');
app.get('/blog', function(data,connect){
	blog.list(connect,app);
});
app.get('/blog/{id}', function(data,connect){
	blog.detail(connect,app,data.id);
});


//实验室
var labs = require('./controller/labs.js');
app.get('/labs', function(data,connect){
	labs.list(connect,app);
});
app.get('/labs/{name}', function(data,connect){
	labs.detail(connect,app,data.name);
});

//作品
var opus = require('./controller/opus.js');
app.get('/opus', function(data,connect){
	opus.list(connect,app);
});
app.get('/opus/{id}', function(data,connect){
	opus.detail(connect,app,data.id);
});

//分享
var share = require('./controller/share.js');
app.get('/share', function(data,connect){
	share.list(connect,app);
});
app.get('/share/{id}', function(data,connect){
	share.detail(connect,app,data.id);
});

//后台
var admin = require('./controller/admin.js');
app.get('/admin/*', function(data,connect){
	admin.render(connect,app);
});

//用户认证
var connect = require('./controller/connect.js');
app.get('/connect/*', function(data,connect){
	connect.write('json',{
		'code' : 500
	})
	//connect.render(connect,app);
});

/**
 * ajax
 *
 */
 
//博客
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

//用户
var ajax_user = require('./ajax/user/index');
app.get('/ajax/user', function(data,connect){
	ajax_user.add_edit(connect,app);
});
app.get('/ajax/user/{mark}', function(data,connect){
	switch(data.mark){
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
		default :
			var id = data.mark;
			ajax_user.detail(connect,app,id);
			
	}
});



