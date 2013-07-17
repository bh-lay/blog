//author bh-lay
var mongo = require('../conf/mongo_connect');
var response = require('../lib/response');


var temp = require('../tpl/page_temp');

exports.deal = function (req,res,pathname){
	var id=pathname.match(/^\/opus\/(\w*)/)[1];
	var page_temp = temp.get('opusDetail',{'init':true});
	
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	mongo.start(function(method){
		
		method.open({'collection_name':'opus'},function(err,collection){
			
			collection.find({id:id}).toArray(function(err, docs) {
				if(arguments[1].length==0){

					response.notFound(res,'哇塞，貌似这作品享不存在哦!');
					
				}else{
					var date=new Date(parseInt(docs[0].opus_time_create));
					docs[0].opus_time_create=(date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+date.getDate();
					var txt = page_temp.replace(/\{-(\w*)-}/g,function(){
						return docs[0][arguments[1]]||'';
					});
					
					response.html(res,200,txt);
					
				}
				method.close();
			});
			
		});
		
	});
}
