/**
 * @author bh-lay
 */
var utils = require('../core/utils/index.js');
var mongo = require('../core/DB.js');

var showdown = require('../lib/showdown/showdown.js');
var converter = new showdown.converter();

function list_page(app,callback){
	var method = mongo.start();
	method.open({
    collection_name : 'labs'
  },function(err,collection){
    if(err){
      callback && callback(err);
      return
    }
    collection.find({}, {limit:15}).sort({id:-1}).toArray(function(err, docs) {
      for(var i in docs){
        docs[i].cover = (docs[i].cover && docs[i].cover[0] == '/') ? app.config.frontEnd.img_domain + docs[i].cover : docs[i].cover;
      }
      method.close();
      callback && callback(null,docs);
    });
  });
}

function get_detail(lab_name,callback){
	//get template
  var method = mongo.start();

  method.open({
    collection_name: 'labs'
  },function(err,collection){
    if(err){
      callback && callback(err);
      return
    }
    collection.find({'name':lab_name}).toArray(function(err, docs) {
      method.close();
      if(arguments[1].length==0){
          callback&&callback('notFound');
      }else{
        docs[0].time_show = utils.parse.time(docs[0].time_create ,'{y}-{m}-{d}');
    //	docs[0].content = markdown.parse(docs[0].content);
        docs[0].content = converter.makeHtml(docs[0].content);
    //	callback&&callback(docs[0].content);
        callback&&callback(null,docs[0]);
      }
    });
  });
}


exports.list = function (connect,app){
  app.cache.use('labs_list',['html','labs'],function(this_cache){
    connect.write('html',200,this_cache);
  },function(save_cache){
    list_page(app,function(err,list){
      if(err){
        app.views('system/mongoFail',{},function(err,html){
          connect.write('html',500,html);
        })
        return;
      }
      //获取视图
      app.views('multi-page/labsList',{
        title : '实验室_小剧客栈_剧中人的个人博客',
        keywords : '造轮子,组件,实验室,剧中人,小剧客栈,前端工程师,设计师,nodeJS',
        description : '剧中人造轮子的基地，汇集小剧开发的部分组件，孕育优秀代码的实验室！',
        list : list
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

exports.detail = function (connect,app,lab_name){
  app.cache.use('labs_id_' + lab_name,['html','labs'],function(this_cache){
    connect.write('html',200,this_cache);
  },function(save_cache){
    //获取作品信息
    get_detail(lab_name,function(err,data){
      if(err){
        if(err == 'notFound'){
          connect.write('notFound','404！');
        }else{
          connect.write('error','怎么坏掉了呢！');
        }
        return
      }
      //获取视图
      app.views('multi-page/labsDetail',{
        title : data.title,
        keywords : data.tags,
        description : data.intro,
        content : data.content,
        git_full_name : data.git_full_name,
        demo_url : data.demo_url
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