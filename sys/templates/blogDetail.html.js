//author bh-lay
var mongo = require('../conf/mongo_connect');
var fs = require('fs');

var tpl = require('../tpl/module_tpl');
var page_temp=fs.readFileSync('./templates/blogDetail.html', "utf8");
page_temp=tpl.init(page_temp);

exports.deal = function (req,res,pathname){
	res.writeHead(200, {'Content-Type': 'text/html'});
	var id=pathname.match(/^\/blog\/(\w*)/)[1];
	mongo.open({'collection_name':'article'},function(err,collection,close){
		collection.find({id:id}).toArray(function(err, docs) {
			if(arguments[1].length==0){
			//FIXME add no article page
				var layFile = require('../conf/layFile');
				layFile.notFound(res,'哇塞，貌似这篇博文不存在哦!');
			}else{
				var date=new Date(parseInt(docs[0].time_show));
				docs[0].time_show=(date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+date.getDate();
				var txt = page_temp.replace(/\{-(\w*)-}/g,function(){
					return docs[0][arguments[1]]||22222;
				});
				res.end(txt);
			}
			close();
		});
	});
}
