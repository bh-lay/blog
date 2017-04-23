/**
 * @author bh-lay
 */

var my720Data = require('../functions/my720Data.js');

exports.list = function (connect,app){
  app.cache.use('pano_list',['html','pano'],function(this_cache){
    connect.write('html',200,this_cache);
  },function(save_cache){
    my720Data.get(function(err, data){
      if(err){
        app.views('system/mongoFail',{},function(err,html){
          connect.write('html',500,html);
        })
        return;
      }//获取视图
      app.views('multi-page/panoList',{
        title : '小剧的全景作品_小剧客栈_剧中人的个人博客',
        keywords : '全景,pano,panorama,vr,剧中人,小剧客栈,前端工程师,设计师,nodeJS',
        description : '剧中人全景拍摄的作品，汇集全景云台、无人机航拍、手机拍全景等多重拍摄方式！',
        list : data.products
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
