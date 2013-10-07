//author bh-lay
var mongo = require('../../../conf/mongo_connect');
var fs = require('fs');

var temp=['<tr>',
	'<td class="arLiTitle">{title}</td>',
	'<td class="arLiTitle">{url}</td>',
	'<td class="arLiTitle">{isShow}</td>',
	'<td class="arLiTitle">{discription}</td>',
	'<td class="arLiTitle">{time_create}</td>',
	'<td class="arLiEdit">',
		'<a title="修改" href="friendDetail.html?id={id}" target="_self">改</a>',
		'<a title="删除" href="/ajax/del?from=blog_friend&id={id}" onclick="if(!confirm(\'三思啊，删了可就没啦！\')){return false;}" target="_self">删</a>',
	'</td>',
'</tr>'].join('');

exports.render = function (req,res_this){

	mongo.start(function(method){
		
		method.open({'collection_name':'blog_friend'},function(err,collection){
	      
	      collection.find().sort({id:-1}).toArray(function(err, docs) {
				var txt = '';
				var tpl = temp;
				for(var i in docs){
					docs[i].time_create = docs[i].time_create?parse.time(docs[i].time_create,'{y}-{m}-{d}'):null;
					
					txt += tpl.replace(/\{(\w*)}/g,function(){
						return docs[i][arguments[1]]||'未填写';
					});
				}
				var tpl = fs.readFileSync('./templates/admin/tool/friendList.html', "utf8");
			
				tpl = tpl.replace('{content}',txt);
				
				res_this.html(200,tpl);

				method.close();
			});
		});
	});
}
