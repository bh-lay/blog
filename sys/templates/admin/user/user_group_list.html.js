//author bh-lay
var fs = require('fs');
var mongo = require('../../../conf/mongo_connect');

var pageTpl = fs.readFileSync('./templates/admin/user/user_group_list.html', "utf8");

var temp=['<tr>',
	'<td>{user_group_name}</td>',
	'<td>{user_group}</td>',
	'<td>{power}</td>',
	'<td>',
		'<a href="user_group.html?id={id}" target="_self">改</a>',
		'<a href="/ajax/del?from=user_group&id={id}" onclick="if(!confirm(\'三思啊，删了可就没啦！\')){return false;}" target="_self">删</a>',
	'</td>',
'</tr>'];

exports.render = function (req,res_this){
	
	var method = mongo.start();
		
	method.open({'collection_name':'user_group'},function(err,collection){

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
