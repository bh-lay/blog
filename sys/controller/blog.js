/*
 * @author bh-lay
 * view url : /blog    /blog/
 */
var mongo = require('../conf/mongo_connect');

var chip = require('../mod/chip');
var temp = require('../mod/page_temp');
var juicer = require('juicer');
var fs = require('fs');
//var markdown = require('markdown');
var showdown = require('../lib/showdown/showdown.js');
var converter = new showdown.converter();

function list_page(callback){
	temp.get('blogList',{'init':true},function(page_temp){
		var method = mongo.start();
		method.open({'collection_name':'article'},function(err,collection){
			collection.find({}, {limit:10}).sort({id:-1}).toArray(function(err, docs) {
				method.close();
				for(var i in docs){
					docs[i].time_show = parse.time(docs[i].time_show ,'{y}-{m}-{d}');
				}
				chip.produce('article_item',{'list' : docs},function(txt){
					var page = page_temp.replace('{-content-}',txt);
					callback(page);
				});
			});
		});
	});
}

function detail_page(id,callback){
	//get template
	temp.get('blogDetail',{'init':true},function(page_temp){
		var method = mongo.start();

		method.open({'collection_name':'article'},function(err,collection){

			collection.find({id:id}).toArray(function(err, docs) {
				method.close();
				if(arguments[1].length==0){
					callback && callback('哇塞，貌似这篇博文不存在哦!');
				}else{
					docs[0].time_show = parse.time(docs[0].time_show ,'{y}-{m}-{d}');
				//	docs[0].content = markdown.parse(docs[0].content);
					docs[0].content = converter.makeHtml(docs[0].content);
					var txt = juicer(page_temp,docs[0]);
				//	callback&&callback(docs[0].content);
					callback&&callback(null,txt);
				}
			});
		});
	});
}

exports.deal = function (req,res_this,path){
	var path_length = path['pathnode'].length;
	if(path_length == 1){
		cache.html('blog_list',function(this_cache){
			//do something with this_cache
			res_this.html(200,this_cache);
		},function(save_cache){
			//if none of cache,do this Fn
			list_page(function(this_html){
				save_cache(this_html);
			});
		}); 
	}else if(path_length == 2){
		var id = path['pathnode'][1];
		cache.html('blog_id_' + id,function(this_cache){
			res_this.html(200,this_cache);
		},function(save_cache){
			detail_page(id,function(err,this_html){
				if(err){
					res_this.notFound(err);
					return
				}
				save_cache(this_html);
			});
		});
	}else{
		res_this.notFound('小盆友，表逗我玩儿！');
	}

}