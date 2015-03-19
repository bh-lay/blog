/**
 * @author bh-lay
 */
var utils = require('../core/utils/index.js');
var mongo = require('../core/DB.js');
var showdown = require('../lib/showdown/showdown.js');

function list_page(app,callback){
	var method = mongo.start();

	method.open({
    collection_name: 'opus'
  },function(err,collection){
    if(err){
      callback && callback(err);
      return
    }
		collection.find({}, {limit:28}).sort({id:-1}).toArray(function(err, docs) {
			method.close();
			for(var i = 0,total = docs.length;i<total;i++){
				docs[i]['work_range'] = docs[i]['work_range']?docs[i]['work_range'].split(/\,/):['暂未填写'];
				docs[i].cover = (docs[i].cover && docs[i].cover[0] == '/') ? app.config.frontEnd.img_domain + docs[i].cover : docs[i].cover;
			}
			callback && callback(null,docs);
		});

	});
}

function detail_page(id,callback){
	var method = mongo.start();
	method.open({
      collection_name: 'opus'
  },function(err,collection){
    if(err){
      callback && callback(err);
      return
    }
		collection.find({id:id}).toArray(function(err, docs) {
			method.close();
			if(docs.length==0){
				callback('哇塞，貌似这作品享不存在哦!');
			}else{
				var converter = new showdown.converter();
				docs[0].content = converter.makeHtml(docs[0].content);
				docs[0].opus_time_create = utils.parse.time(docs[0].opus_time_create ,'{y}-{m}-{d}');
				callback && callback(null,docs[0]);
			}
		});
	});
}

exports.list = function(connect,app){
	app.cache.use('opus_list',['html'],function(this_cache){
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
			app.views('opusList',{
				'title' : '作品',
				'keywords' : '剧中人,bh-lay,网站建设,网页设计,设计师',
				'description' : '小剧客栈是剧中人精心营造的一个向广大设计爱好者、喜欢剧中人开放的博客，小剧希望用设计师鞭策自己，愿意和你共同分享，一起进步！',
				'list' : list
			},function(err,html){
				save_cache(html);
			});
		});
	});
};

exports.detail = function(connect,app,id){
	app.cache.use('opus_id_' + id,['html'],function(this_cache){
		connect.write('html',200,this_cache);
	},function(save_cache){
		detail_page(id,function(err,data){
      if(err){
        app.views('system/mongoFail',{},function(err,html){
          connect.write('html',500,html);
        })
        return;
      }
			//获取视图
			app.views('opusDetail',{
				'title' : data.title,
				'keywords' : data.tags,
				'description' : data.intro,
				'content' : data.content,
				'opus_pic' : data.opus_pic,
				'cover' : (data.cover && data.cover[0] == '/') ? app.config.frontEnd.img_domain + data.cover : data.cover,
				'opus_time_create' : data.opus_time_create
			},function(err,html){
				save_cache(html);
			});
		});
	});
}