//author bh-lay
var utils = require('../core/utils/index.js');
var mongo = require('../core/DB');

function getList(callback){
  var method = mongo.start();
  method.open({
    collection_name: 'blog_friend'
  },function(err,collection){
    if(err){
      callback && callback(err);
      return;
    }
    collection.find({
      isShow: '1'
    }).sort({
      score: -1
    }).toArray(function(err, docs) {
      if(err){
        callback && callback(err);
        return;
      }
      callback && callback(null,docs);
      method.close();
    });
  });
};
exports.render = function (connect,app){
  //缓存机制
  app.cache.use('links_page',['html','links'],function(this_cache){
    connect.write('html',200,this_cache);
  },function(save_cache){
      getList(function(err,list){
        if(err){
          app.views('system/mongoFail',{},function(err,html){
            connect.write('html',500,html);
          });
          return;
        }
        list.forEach(function(item){
          item.url = utils.trim(item.url);
          item.screen_link = (item.url || '').replace(/http\:\/\/(www\.|)|\/$|/g,'');
          item.avatar = item.avatar || 'http://static.bh-lay.com/user/default.jpg';
        });
        //获取视图
        app.views('multi-page/links',{
            title : '前端英雄榜_特大号的WEB屌丝们',
            keywords : '剧中人,程序员,前端工程师,网页设计,设计师',
            description : '一帮程序员,前端工程师,网页设计,设计师，一群纯屌丝！',
            list: list
        },function(err,html){
          if(err){
            connect.write('html',200,'<h1>页面挂了！</h1>');
          }else{
            save_cache(html);
          }
        });
      });
  });
};
