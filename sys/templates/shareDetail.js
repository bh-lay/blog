//author bh-lay
var fs = require('fs');
var mongo = require('../conf/mongo_connect');
var tpl = require('../tpl/module_tpl');
var page_temp=fs.readFileSync('./templates/shareDetail.html', "utf8");
page_temp = tpl.init(page_temp);

exports.deal = function (req,res,pathname){
	res.writeHead(200, {'Content-Type': 'text/html'});
	var id=pathname.match(/^\/share\/(\w*)/)[1];
	
	mongo.start(function(method){
		
		method.open({'collection_name':'share'},function(err,collection){
			
			collection.find({id:id}).toArray(function(err, docs) {
				if(arguments[1].length==0){
				//FIXME add no article page
					var layFile = require('../conf/layFile');
					layFile.notFound(res,'哇塞，貌似这篇分享不存在哦!');
				}else{
					var date=new Date(parseInt(docs[0].time_show));
					docs[0].time_show=(date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+date.getDate();
					var txt = page_temp.replace(/\{-(\w*)-}/g,function(){
						return docs[0][arguments[1]]||'';
					});
					res.end(txt);
				}
				method.close();
			});
			
		});
		
	});
}
