/**
 * @author bh-lay
 */
var mongo = require('../mod/DB');
var parse = require('../lib/parse');

function list_page(callback){
	var method = mongo.start();
	method.open({'collection_name':'share'},function(err,collection){
		collection.find({}, {limit:15}).sort({id:-1}).toArray(function(err, docs) {
			for(var i in docs){
				docs[i].cover = (docs[i].cover && docs[i].cover[0] == '/') ? CONFIG.img_domain + docs[i].cover : docs[i].cover;
			}
			method.close();
			callback && callback(null,docs);
		});
	});
}

function detail_page(id,callback){
	var method = mongo.start();
	method.open({'collection_name':'share'},function(err,collection){
		collection.find({id:id}).toArray(function(err, docs) {
			method.close();
			if(docs.length==0){
				callback && callback('哇塞，貌似这篇分享不存在哦!');
			}else{
				docs[0].time_show = parse.time(docs[0].time_show ,'{y}-{m}-{d}');
				callback && callback(null,docs[0]);
			}
		});
	});
}

exports.list = function(connect,app){
	app.cache.html('share_list',function(this_cache){
		connect.write('html',200,this_cache);
	},function(save_cache){
		list_page(function(err,list){
			//获取视图
			app.views('shareList',{
				'title' : '分享',
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
	app.cache.html('share_id_' + id,function(this_cache){
		connect.write('html',200,this_cache);
	},function(save_cache){
		detail_page(id,function(err,data){
			if(err){
				connect.write('notFound','这篇分享不存在！');
				return
			}
			//获取视图
			app.views('shareDetail',{
				'title' : data.title,
				'keywords' : data.tags,
				'description' : data.intro,
				'content' : data.content,
				'time_show' : data.time_show
			},function(err,html){
				save_cache(html);
			});
		});
	});
}