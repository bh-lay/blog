/**
 * @author bh-lay
 */
var mongo = require('../conf/mongo_connect');
var temp = require('../mod/page_temp');
var chip = require('../mod/chip');
var juicer = require('juicer');
var views = require('../mod/views');
var component = require('../mod/component');

var showdown = require('../lib/showdown/showdown.js');
var converter = new showdown.converter();

function list_page(callback){
	temp.get('labsList',{'init':true},function(page_temp){
		var method = mongo.start();
		method.open({'collection_name' : 'labs'},function(err,collection){
			collection.find({}, {limit:15}).sort({id:-1}).toArray(function(err, docs) {
				method.close();
				chip.produce('labs_item',{'list':docs},function(txt){
					var page_txt = page_temp.replace('{-content-}',txt);
					callback(page_txt);
				});
			});
		});
	});
}

function detail_page(id,callback){
	//get template
	temp.get('labsDetail',{'init':true},function(page_temp){
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
	});
}

exports.deal = function (req,res_this,path){
	var path_length = path['pathnode'].length;
	if(path_length == 1){
		cache.html('labs_list',function(this_cache){
			res_this.html(200,this_cache);
		},function(save_cache){
			list_page(function(this_html){
				save_cache(this_html);
			});
		});
	}else if(path_length == 2){
		var id = path['pathnode'][1];
		
		//获取作品信息
		detail_page(id,function(err,data){
			cache.html('labs_id_' + id,function(this_cache){
				res_this.html(200,this_cache);
			},function(save_cache){
				//获取视图
				views.get('labsDetail',{
					'title' : data.title,
					'keywords' : data.tags,
					'description' : data.intro,
					'content' : data.content,
					'git_full_name' : data.git_full_name
				},function(err,html){
					save_cache(html);
				});
			});
		});
		
		
	}else{
		res_this.notFound('小盆友，表逗我玩儿！');
	}
}