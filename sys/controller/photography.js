/**
 * @author bh-lay
 */

var myTuchongData = require('../functions/myTuchongData.js');

exports.list = function (connect,app){
  app.cache.use('photography_list',['html','photography'],function(this_cache){
    connect.write('html',200,this_cache);
  },function(save_cache){
    myTuchongData.get(function(err, data){
      if(err){
        app.views('system/mongoFail',{},function(err,html){
          connect.write('html',500,html);
        })
        return;
      }//获取视图
      app.views('multi-page/photographyList',{
        title : '小剧的摄影作品_小剧客栈_剧中人的个人博客',
        keywords : '摄影,剧中人,小剧客栈,前端工程师,设计师,nodeJS',
        description : '剧中人摄影的作品，汇集单反、无人机航拍、手机等多种拍摄方式！',
        list : data.post_list
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
