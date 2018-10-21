//引入app框架
var app_factory = require('../sys/core/index.js'),
    CronJob = require('cron').CronJob,
    isbot = require('node-isbot');

//创建app
var app = new app_factory();

/**
 * 选择静态、动态视图版本
 *
 */
var singlePage = require('./controller/singlePage.js');
function views_select(connect,callback){
  var isBotRequest = isbot(connect.request.headers['user-agent']);
  var isMarkJSVersion = connect.cookie('ui_version') == 'js';
  // 不是爬虫，并且 cookie 中已经标记使用单页版本
  if (!isBotRequest && isMarkJSVersion) {
    singlePage.render(connect,app);
  } else {
    // 无 cookie 标识，执行回调默认视图
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
//前端英雄榜
var links = require('./controller/links.js');
app.get('/directories', function(data,connect){
  links.render(connect,app);
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
var pano = require('./controller/pano.js');
app.get('/720', function(data,connect){
  views_select(connect,function(){
    pano.list(connect, app);
  });
});
var photography = require('./controller/photography.js');
app.get('/photography', function(data,connect){
  views_select(connect,function(){
    photography.list(connect, app);
  });
});
app.get('/labs/{name}', function(data,connect){
  labs.detail(connect,app,data.name);
});

//后台
var admin = require('./controller/admin.js');
app.get('/admin/*', function(data,connect){
  admin.render(connect,app);
});

//用户登录认证
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


//验证码
var verifycode = require('./controller/verifycode.js');
app.get('/verifycode', function(data,connect){
  verifycode.render(connect,app);
});

/**
 * 数据上报搜集
 */
var reportCollect = require('./controller/report.js');
app.get('/r/collect', function( data, connect ){
  reportCollect.render(connect, app);
});



/**
 * ajax
 *
 */
var ajax_user = require('./ajax/user/index'),
    ajax_add_edit = require('./ajax/add&edit.js'),
    ajax_comments = require('./ajax/comments/index.js'),
    ajax_links = require('./ajax/links/index.js'),
    ajax_del = require('./ajax/del'),
    ajax_user_group = require('./ajax/user/user_group_add&edit'),
    ajax_power = require('./ajax/user/power'),
    ajax_demo = require('./ajax/demo/index'),
    ajax_tag =  require('./ajax/tag/index.js'),
    ajax_functions =  require('./ajax/functions.js');

//通用增加&编辑
app.get('/ajax/add_edit', function(data,connect){
  ajax_add_edit.render(connect,app);
});

//博客
var ajax_blog = require('./ajax/article_get');
app.get('/ajax/blog', function(data,connect){
  ajax_blog.render(connect,app);
});
//实验室
var ajax_labs = require('./ajax/labs_get'),
    ajax_labs_update = require('./ajax/labs/updateGitInfo');
app.get('/ajax/labs', function(data,connect){
  ajax_labs.render(connect,app);
});
app.get('/ajax/labs/updateGitInfo', function(data,connect){
  ajax_labs_update.render(connect,app);
});

//友情链接
app.get('/ajax/links/list', function(data,connect){
  ajax_links.list(connect,app);
});
app.get('/ajax/links/detail/{id}', function(data,connect){
  ajax_links.detail(connect,app,data.id);
});
app.get('/ajax/links/add_edit', function(data,connect){
  ajax_links.add_edit(connect,app,data.id);
});
app.get('/ajax/links/post', function(data,connect){
  ajax_links.post(connect,app,data.id);
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
app.get('/ajax/demo/*', function(data,connect){
  ajax_demo.render(connect,app);
});

//权限
app.get('/ajax/power', function(data,connect){
  connect.write('json',{
    'code' : 500
  });
//  ajax_power.render(connect,app);
});

//用户组
app.get('/ajax/user_group', function(data,connect){
  connect.write('json',{
    'code' : 500
  });
//  ajax_user_group.render(connect,app);
});

//公用删除接口
app.get('/ajax/del', function(data,connect){
  ajax_del.render(connect,app);
});

//评论
app.get('/ajax/comments/{mark}', function(data,connect){
  var mark = data.mark;
  //尝试使用ajax模块提供接口
  if(ajax_comments[mark]){
    ajax_comments[mark](connect,app);
  }else{
    connect.write('json',{
      'code' : 404
    });
  }
});

//标签模块
app.get('/ajax/tag/{act}', function(data,connect){
  var act = data.act;
  //尝试使用ajax模块提供接口
  if(ajax_tag[act]){
    ajax_tag[act](connect,app);
  }else{
    connect.write('json',{
      'code' : 500
    });
  }
});

//用户
app.get('/ajax/user/{act}', function(data,connect){
  var act = data.act;
  //尝试使用ajax模块提供接口
  if(ajax_user[act]){
    ajax_user[act](connect,app);
  }else{
    connect.write('json',{
      'code' : 500
    });
  }
});

app.get('/ajax/functions/{act}',function(data,connect){
  var act = data.act;
  ajax_functions(connect,app,act);
});

// 获取微信JSSDK配置
// var ajax_wechat = require('./ajax/wechat.js');
// app.get('/ajax/getWechatJsapiSign', function( data, connect ){
//   ajax_wechat.getWechatJsapiSign( connect, app );
// });

// 获取全景图数据
var ajax_pano = require('./ajax/pano_get.js');
app.get('/ajax/pano/list', function( data, connect ){
  ajax_pano.render( connect, app );
});
// 获取图虫数据
var ajax_photography = require('./ajax/photography_get.js');
app.get('/ajax/photography/list', function( data, connect ){
  ajax_photography.render(connect, app);
});


/**
 * 计划任务
 **/
var updateLabsDataFromGithub = require('../sys/functions/updateLabsDataFromGithub.js'),
    updateFriendsScore = require('../sys/functions/updateFriendsScore.js'),
    my720Data = require('../sys/functions/my720Data.js'),
    myTuchongData = require('../sys/functions/myTuchongData.js'),
    myGithubData = require('../sys/functions/myGithubData.js');
//每晚三点
new CronJob('01 01 03 * * *', function() {
  //更新实验室里的Github数据
  updateLabsDataFromGithub.all();
  //更新个人Github信息
  myGithubData.update();
  // 更新前端英雄榜分数
  updateFriendsScore.update();
  // 更新720云数据
  my720Data.update();
  // 更新图虫数据
  myTuchongData.update();
}, null, true, 'Asia/Hong_Kong');

//每晚三点零十分
new CronJob('01 10 03 * * *', function() {
  //清除缓存
  app.cache.clear();
}, null, true, 'Asia/Hong_Kong');