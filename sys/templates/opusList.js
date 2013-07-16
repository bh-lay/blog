/**
 * @author bh-lay
 * view url : /blog    /blog/
 */
var mongo = require('../conf/mongo_connect');
var tpl = require('../tpl/module_tpl');

var fs = require('fs');
var page_temp=fs.readFileSync('./templates/opusList.html', "utf8");
page_temp=tpl.init(page_temp);

exports.deal = function (req,res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	mongo.start(function(method){
		
		method.open({'collection_name':'opus'},function(err,collection){
			
			collection.find({}, {limit:28}).sort({id:-1}).toArray(function(err, docs) {
				
				var txt='';
				if(docs.length>0){
					var temp=tpl.get('opus_item');
					for(var i in docs){
						var date=new Date(parseInt(docs[i].time_show*1000));
						docs[i].time_show=(date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+date.getDate();
						docs[i].cover=docs[i].cover||'/images/notimg.gif';
						txt+=temp.replace(/\{-(\w*)-}/g,function(){
							return docs[i][arguments[1]]||'';
						});
					}
				}else{
					txt = '无数据';				
				}
				txt = page_temp.replace('{-content-}',txt);
				res.write(txt);
				res.end();
				method.close();
			});
			
		});
		
	});
}
