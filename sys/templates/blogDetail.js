//author bh-lay
var mongo = require('../conf/mongo_connect');

var temp = require('../tpl/page_temp');

exports.deal = function (req,res,res_this,pathname){

	var id = pathname.match(/^\/blog\/(\w*)/)[1];
	//get template
	var page = temp.get('blogDetail',{'init':true});
		
	mongo.start(function(method){
		
		method.open({'collection_name':'article'},function(err,collection){
			
			collection.find({id:id}).toArray(function(err, docs) {
				if(arguments[1].length==0){
				
					res_this.notFound('哇塞，貌似这篇博文不存在哦!');
					
				}else{
					var date=new Date(parseInt(docs[0].time_show));
					docs[0].time_show=(date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+date.getDate();
					var txt = page.replace(/\{-(\w*)-}/g,function(){
						return docs[0][arguments[1]]||22222;
					});
					
					res_this.html(200,txt);
				}
				method.close();
			});
			
		});
		
	});
}
