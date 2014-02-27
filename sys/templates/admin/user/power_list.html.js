//author bh-lay

var fs = require('fs');
var mongo = require('../../../conf/mongo_connect');
var pageTpl = fs.readFileSync('./templates/admin/user/power_list.html', "utf8");
var temp = ['<li><h3>',
	'<i>{id}</i><span>{name}</span></h3>',
	'<p>{discription}</p>',
	'<a href="/ajax/del?from=power&id={id}" onclick="if(!confirm(\'三思啊，删了可就没啦！\')){return false;}" target="_self">删</a>',
	'</li>'];

exports.render = function (req,res_this){
	var method = mongo.start();
	method.open({'collection_name':'power'},function(err,collection){
		collection.find({},{}).toArray(function(err, docs) {
			var txt='';
			var tpl = temp.join('');
			for(var i in docs){
				txt += tpl.replace(/\{(\w*)}/g,function(){
					return docs[i][arguments[1]]||'';
				});
			}
			
			var page = pageTpl.replace('{-content-}',txt);
			
			res_this.html(200,page);
			
			method.close();
		});
	});
}