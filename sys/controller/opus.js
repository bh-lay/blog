/**
 * @author bh-lay
 */
var mongo = require('../conf/mongo_connect');
var views = require('../mod/views');
var component = require('../mod/component');

function list_page(callback){
	var method = mongo.start();

	method.open({'collection_name':'opus'},function(err,collection){

		collection.find({}, {limit:28}).sort({id:-1}).toArray(function(err, docs) {
			method.close();
			for(var i = 0,total = docs.length;i<total;i++){
				docs[i]['work_range'] = docs[i]['work_range']?docs[i]['work_range'].split(/\,/):['暂未填写'];
			}
			callback && callback(null,docs);
		});

	});
}

function detail_page(id,callback){
	var method = mongo.start();
	method.open({'collection_name':'opus'},function(err,collection){
		collection.find({id:id}).toArray(function(err, docs) {
			method.close();
			if(docs.length==0){
				callback('哇塞，貌似这作品享不存在哦!');
			}else{
				docs[0].opus_time_create = parse.time(docs[0].opus_time_create ,'{y}-{m}-{d}');
				callback && callback(null,docs[0]);
			}
		});
	});
}

exports.deal = function (req,res_this,path){
	var path_length = path['pathnode'].length;
	if(path_length == 1){
		cache.html('opus_list',function(this_cache){
			res_this.html(200,this_cache);
		},function(save_cache){
			list_page(function(err,list){
				//获取视图
				views.get('opusList',{
					'title' : '作品',
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
		cache.html('opus_id_' + id,function(this_cache){
			res_this.html(200,this_cache);
		},function(save_cache){
			detail_page(id,function(err,data){
				//获取视图
				views.get('opusDetail',{
					'title' : data.title,
					'keywords' : data.tags,
					'description' : data.intro,
					'content' : data.content,
					'opus_pic' : data.opus_pic,
					'opus_time_create' : data.opus_time_create
				},function(err,html){
					save_cache(html);
				});
			});
		});
	}else{
		res_this.notFound('小盆友，表逗我玩儿！');
	}
}