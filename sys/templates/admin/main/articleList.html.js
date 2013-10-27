//author bh-lay
var fs = require('fs');
var mongo = require('../../../conf/mongo_connect');
var page = require('../../../lib/page_list');

var temp=['<tr>',
	'<td class="arLiTitle"><a title="查看博文" href="/blog/{id}" target="_blank">{title}</a></td>',
	'<td class="arLiEdit">',
		'<a title="修改" href="article.html?articleID={id}" target="_self">改</a>',
		'<a title="删除" href="/ajax/del?from=blog&id={id}" onclick="if(!confirm(\'三思啊，删了可就没啦！\')){return false;}" target="_self">删</a>',
	'</td>',
	'<td class="arLiTime">{time_show}</td>',
'</tr>'];


exports.render = function (req,res_this){

	var parm = {'url_base':'/admin/main/articleList.html'};
		parm['page_cur'] = req.url.split('?')[1] || 1;
		parm['page_list_num'] = 10 ;
		parm['page_cur'] = parseInt(parm['page_cur']);
	var skip_list=parm['page_list_num']*(parm['page_cur']-1);
	
	var method = mongo.start();
		
		method.open({'collection_name':'article'},function(err,collection){

			//count the all list
			collection.count(function(err,count){
				parm['list_count'] = count;
			});
	      
	      collection.find({},{limit:parm['page_list_num']}).sort({id:-1}).skip(skip_list).toArray(function(err, docs) {
				var txt='';
				var tpl=temp.join('');
				for(var i in docs){
					docs[i].time_show = parse.time(docs[i].time_show,'{y}-{m}-{d}');

					txt+=tpl.replace(/\{(\w*)}/g,function(){
						return docs[i][arguments[1]]||22222;
					});
				}
				var tpl=fs.readFileSync('./templates/admin/main/articleList.html', "utf8");
				
				var pageListTpl = page.render(parm);
				tpl = tpl.replace('{pageBar}',pageListTpl);
			
				tpl = tpl.replace('{content}',txt);
				
				res_this.html(200,tpl);
				
				method.close();
			});
		});
}
