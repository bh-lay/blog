//author bh-lay
var mongo = require('../../../conf/mongo_connect');
var fs = require('fs');
var parse = require('../../../lib/parse');

var temp=['<tr>',
	'<td class="arLiTitle">{title}</td>',
	'<td class="arLiTitle">{url}</td>',
	'<td class="arLiTitle">{discription}</td>',
	'<td class="arLiTitle">{add_time}</td>',
	'<td class="arLiEdit">',
		'<a title="修改" href="{id}" target="_self">改</a>',
		'<a title="删除" href="{id}" onclick="if(!confirm(\'三思啊，删了可就没啦！\')){return false;}" target="_self">删</a>',
	'</td>',
	'<td class="arLiTime">{time_show}</td>',
'</tr>'].join('');

exports.render = function (req,res_this){

	mongo.start(function(method){
		
		method.open({'collection_name':'blog_friend'},function(err,collection){
	      
	      collection.find().sort({id:-1}).toArray(function(err, docs) {
				var txt = '';
				var tpl = temp;
				for(var i in docs){
					docs[i].time_show = parse.time(docs[i].time_show,'{y}-{m}-{d}');
					
					txt += tpl.replace(/\{(\w*)}/g,function(){
						return docs[i][arguments[1]]||22222;
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
