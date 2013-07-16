//author bh-lay
var mongo = require('../../../conf/mongo_connect');
var fs = require('fs');

var pageTpl = fs.readFileSync('./templates/admin/user/userList.html', "utf8");

var temp=['<tr>',
	'<td>{username}</td>',
	'<td>{usernick}</td>',
	'<td>{user_group}</td>',
	'<td>',
		'<a href="user.html?userid={id}" target="_self">改</a>',
		'<a href="/ajax/del?from=user&id={id}" onclick="if(!confirm(\'三思啊，删了可就没啦！\')){return false;}" target="_self">删</a>',
	'</td>',
'</tr>'];


exports.render = function (req,res){
	res.writeHead(200, {'Content-Type': 'text/html'});
	
	mongo.start(function(method){

		method.open({'collection_name':'user'},function(err,collection){
	
	      collection.find({},{}).toArray(function(err, docs) {
				var txt='';
				var tpl = temp.join('');
				for(var i in docs){
					txt += tpl.replace(/\{(\w*)}/g,function(){
						return docs[i][arguments[1]]||'';
					});
				}
				
				var page = pageTpl.replace('{-content-}',txt);
				res.write(page);
				res.end();
				method.close();
			});
		});
	});
}
