//author bh-lay
var mongo = require('../conf/mongo_connect');
var fs = require('fs');
var layFile = require('../lib/layFile');

var tpl = require('../tpl/module_tpl');
var page_temp=fs.readFileSync('./templates/opusDetail.html', "utf8");
page_temp=tpl.init(page_temp);

exports.deal = function (req,res,pathname){
	res.writeHead(200, {'Content-Type': 'text/html'});
	var id=pathname.match(/^\/opus\/(\w*)/)[1];
	
	mongo.start(function(method){
		
		method.open({'collection_name':'opus'},function(err,collection){
			
			collection.find({id:id}).toArray(function(err, docs) {
				if(arguments[1].length==0){
				//FIXME add no article page
					layFile.notFound(res,'哇塞，貌似这篇分享不存在哦!');
				}else{
					var date=new Date(parseInt(docs[0].opus_time_create));
					docs[0].opus_time_create=(date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+date.getDate();
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
