/**
 * @author bh-lay
 */
var mongo = require('../conf/mongo_connect');
var juicer = require('juicer');
var views = require('../mod/views');
var component = require('../mod/component');

var showdown = require('../lib/showdown/showdown.js');
var converter = new showdown.converter();

function list_page(callback){
	var method = mongo.start();
	method.open({'collection_name' : 'labs'},function(err,collection){
		collection.find({}, {limit:15}).sort({id:-1}).toArray(function(err, docs) {
			method.close();
			callback && callback(null,docs);
		});
	});
}

function get_detail(id,callback){
	//get template
	var method = mongo.start();

	method.open({'collection_name':'labs'},function(err,collection){

		collection.find({id:id}).toArray(function(err, docs) {
			method.close();
			if(arguments[1].length==0){
				callback&&callback('哇塞，貌似这个插件不存在哦!');
			}else{
				docs[0].time_show = parse.time(docs[0].time_create ,'{y}-{m}-{d}');
			//	docs[0].content = markdown.parse(docs[0].content);
				docs[0].content = converter.makeHtml(docs[0].content);
			//	callback&&callback(docs[0].content);
				callback&&callback(null,docs[0]);
			}
		});
	});
}

exports.deal = function (req,res_this,path){
	var path_length = path['pathnode'].length;
	if(path_length == 1){
		cache.html('labs_list',function(this_cache){
			res_this.html(200,this_cache);
		},function(save_cache){
			list_page(function(err,list){
				//获取视图
				views.get('labsList',{
					'title' : '实验室',
					'keywords' : '剧中人,bh-lay,网站建设,网页设计,设计师',
					'description' : '小剧客栈是剧中人精心营造的一个向广大设计爱好者、喜欢剧中人开放的博客，小剧希望用设计师鞭策自己，愿意和你共同分享，一起进步！',
					'list' : list
				},function(err,html){
					save_cache(html);
				});
			});
		});
	}else if(path_length == 2){
		var id = path['pathnode'][1];
		
		cache.html('labs_id_' + id,function(this_cache){
			res_this.html(200,this_cache);
		},function(save_cache){
			//获取作品信息
			get_detail(id,function(err,data){
				//获取视图
				views.get('labsDetail',{
					'title' : data.title,
					'keywords' : data.tags,
					'description' : data.intro,
					'content' : data.content,
					'git_full_name' : data.git_full_name,
					'demo_url' : data.demo_url
				},function(err,html){
					save_cache(html);
				});
			});
		});
	}else{
		res_this.notFound('小盆友，表逗我玩儿！');
	}
};