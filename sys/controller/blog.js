/*
 * @author bh-lay
 * view url : /blog    /blog/
 */


var parse = require('../core/parse');
var mongo = require('../core/DB.js');
var showdown = require('../lib/showdown/showdown.js');
var converter = new showdown.converter();

function getDetail(id,callback){
	var method = mongo.start();
	method.open({'collection_name':'article'},function(err,collection){

		collection.find({
			'id' : id
		}).toArray(function(err, docs) {
			method.close();
			if(arguments[1].length==0){
				callback && callback('哇塞，貌似这篇博文不存在哦!');
			}else{
				docs[0].time_show = parse.time(docs[0].time_show ,'{y}-{m}-{d}');
				docs[0].content = converter.makeHtml(docs[0].content);
				callback&&callback(null,docs[0]);
			}
		});
	});
}

function getList(param,callback){
	var method = mongo.start();
	var param = param || {};
	var skip = param.skip || 0;
	var limit = param.limit || 10;
	
	method.open({'collection_name':'article'},function(err,collection){
		collection.count(function(err,count){
			collection.find({}, {
				limit:limit
			}).sort({id:-1}).skip(skip).toArray(function(err, docs) {
				method.close();
				for(var i in docs){
					docs[i].time_show = parse.time(docs[i].time_show ,'{y}年-{m}月-{d}日');
					docs[i].cover = (docs[i].cover && docs[i].cover[0] == '/') ? CONFIG.img_domain + docs[i].cover : docs[i].cover;
				}
				callback && callback(null,docs,{
					'count' : count,
					'skip' : skip,
					'limit' : limit
				});
			});
		});
	});
};
exports.list = function (connect,app){
	
	var data = connect.url.search;
	
	var page = data.page || 1;
	
	var cache_name = 'blog_list_' + page;
	app.cache.html(cache_name,function(this_cache){
		//do something with this_cache
		connect.write('html',200,this_cache);
	},function(save_cache){
		//if none of cache,do this Fn
		getList({
			'skip' : (page-1) * 10,
			'limit': 10
		},function(err,list,data){
			var page_html = app.utils.pagination({
				'list_count' : data.count,
				'page_list_num': data.limit,
				'page_cur': page,
				'max_page_btn': 10,
				'base_url' : '/blog?page={num}'
			});
			//获取视图
			app.views('blogList',{
				'title' : '我的博客',
				'keywords' : '剧中人,bh-lay,网站建设,网页设计,设计师',
				'description' : '小剧客栈是剧中人精心营造的一个向广大设计爱好者、喜欢剧中人开放的博客，小剧希望用设计师鞭策自己，愿意和你共同分享，一起进步！',
				'list' : list,
				'pagination' : page_html
			},function(err,html){
				save_cache(html);
			});
		});
	});
};

exports.detail = function (connect,app,id){
	app.cache.html('blog_id_' + id,function(this_cache){
		connect.write('html',200,this_cache);
	},function(save_cache){
		getDetail(id,function(err,data){
			if(err){
				connect.write('notFound','404');
				return;
			}
			//获取视图
			app.views('blogDetail',{
				'id' : id,
				'title' : data.title,
				'keywords' : data.tags,
				'description' : data.intro,
				'time_show' : data.time_show,
				'author' : data.author,
				'cover' : data.cover,
				'tags' : data.tags,
				'content' : data.content
			},function(err,html){
				save_cache(html);
			});
		})
	});
}