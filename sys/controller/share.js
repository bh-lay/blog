//author bh-lay
var mongo = require('../conf/mongo_connect');
var temp = require('../lib/page_temp');
var tpl = require('../lib/module_tpl');
var parse = require('../lib/parse');

function list_page(res_this){
	var page_temp = temp.get('shareList',{'init':true});
	
	mongo.start(function(method){
		
		method.open({'collection_name':'share'},function(err,collection){
			
			collection.find({}, {limit:15}).sort({id:-1}).toArray(function(err, docs) {
				
				var txt = tpl.produce('share_item',{'list':docs});
				
				var page_txt = page_temp.replace('{-content-}',txt);
				
				res_this.html(200,page_txt);
				
				method.close();
			});
			
		});
		
	});
}

function detail_page(res_this,id){
	var page_temp = temp.get('shareDetail',{'init':true});
	
	mongo.start(function(method){
		
		method.open({'collection_name':'share'},function(err,collection){
			
			collection.find({id:id}).toArray(function(err, docs) {
				if(docs.length==0){

					res_this.notFound('哇塞，貌似这篇分享不存在哦!');
					
				}else{
					docs[0].time_show = parse.time(docs[0].time_show ,'{y}-{m}-{d}');
			
					var juicer = require('juicer');
					var txt = juicer(page_temp,docs[0]);
					res_this.html(200,txt);
					
				}
				method.close();
			});
			
		});
		
	});
}

exports.deal = function (req,res_this,path){
	var path_length = path['pathnode'].length;
	if(path_length == 1){
		list_page(res_this);
	}else if(path_length == 2){
		var id = path['pathnode'][1];
		detail_page(res_this,id)
	}else{
		res_this.notFound('小盆友，表逗我玩儿！');
	}
}
