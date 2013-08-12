//author bh-lay
var mongo = require('../conf/mongo_connect');
var temp = require('../lib/page_temp');
var tpl = require('../lib/module_tpl');

function list_page(res_this){
	var page_temp = temp.get('shareList',{'init':true});
	var list_temp = tpl.get('share_item');
	
	mongo.start(function(method){
		
		method.open({'collection_name':'share'},function(err,collection){
			
			collection.find({}, {limit:15}).sort({id:-1}).toArray(function(err, docs) {
				var txt='';
				for(var i in docs){
					var date=new Date(parseInt(docs[i].time_show*1000));
					docs[i].time_show=(date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+date.getDate();
					docs[i].cover=docs[i].cover||'/images/notimg.gif';
					txt+=list_temp.replace(/\{-(\w*)-}/g,function(){
						return docs[i][arguments[1]]||'';
					});
				}
				txt = page_temp.replace('{-content-}',txt);
				
				res_this.html(200,txt);
				
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
					var date = new Date(parseInt(docs[0].time_show));
					docs[0].time_show = (date.getYear()+1900)+'-'+(date.getMonth()+1) + '-' + date.getDate();
					var txt = page_temp.replace(/\{-(\w*)-}/g,function(){
						return docs[0][arguments[1]]||'';
					});
					
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
