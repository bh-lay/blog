/*
 * @author bh-lay
 * view url : /blog    /blog/
 */
var mongo = require('../conf/mongo_connect');

var tpl = require('../lib/module_tpl');
var temp = require('../lib/page_temp');
			
exports.deal = function (req,res_this){
	var page_temp = temp.get('blogList',{'init':true});
	var list_temp = tpl.get('article_item');

	mongo.start(function(method){
		
		method.open({'collection_name':'article'},function(err,collection){
			
			collection.find({}, {limit:10}).sort({id:-1}).toArray(function(err, docs) {
				var txt='';
				for(var i in docs){
					var date=new Date(parseInt(docs[i].time_show));
					docs[i].time_show=(date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+date.getDate();
					docs[i].cover=docs[i].cover||'/images/notimg.gif';
					txt += list_temp.replace(/\{-(\w*)-}/g,function(){
						return docs[i][arguments[1]]||'';
					});
				}
				var page = page_temp.replace('{-content-}',txt);
				
				res_this.html(200,page);
				
				method.close();
			});
			
		});
		
	});
}
