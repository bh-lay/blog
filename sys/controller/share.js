/**
 * @author bh-lay
 */
var mongo = require('../conf/mongo_connect');
var temp = require('../mod/page_temp');
var chip = require('../mod/chip');

function list_page(callback){
	temp.get('shareList',{'init':true},function(page_temp){
		var method = mongo.start();
		method.open({'collection_name':'share'},function(err,collection){
			collection.find({}, {limit:15}).sort({id:-1}).toArray(function(err, docs) {
				method.close();
				chip.produce('share_item',{'list':docs},function(txt){
					var page_txt = page_temp.replace('{-content-}',txt);
					callback(page_txt);
				});
			});
		});
	});
}

function detail_page(id,callback){
	temp.get('shareDetail',{'init':true},function(page_temp){
		var method = mongo.start();
		method.open({'collection_name':'share'},function(err,collection){
			collection.find({id:id}).toArray(function(err, docs) {
				method.close();
				if(docs.length==0){
					res_this.notFound('哇塞，貌似这篇分享不存在哦!');
				}else{
					docs[0].time_show = parse.time(docs[0].time_show ,'{y}-{m}-{d}');

					var juicer = require('juicer');
					var txt = juicer(page_temp,docs[0]);
					callback(txt);
				}
			});
		});
	});
}

exports.deal = function (req,res_this,path){
	var path_length = path['pathnode'].length;
	if(path_length == 1){
		cache.html('share_list',function(this_cache){
			res_this.html(200,this_cache);
		},function(save_cache){
			list_page(function(this_html){
				save_cache(this_html);
			});
		});
	}else if(path_length == 2){
		var id = path['pathnode'][1];
		cache.html('share_id_' + id,function(this_cache){
			res_this.html(200,this_cache);
		},function(save_cache){
			detail_page(id,function(this_html){
				save_cache(this_html);
			});
		});
	}else{
		res_this.notFound('小盆友，表逗我玩儿！');
	}
}