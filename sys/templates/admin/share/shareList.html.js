//author bh-lay
var mongo = require('../../../conf/mongo_connect');
var fs = require('fs');
var page = require('../../../lib/page_list');

var temp=['<tr>',
	'<td class="arLiTitle"><a title="查看分享" href="/share/{id}" target="_blank">{title}</a></td>',
	'<td class="arLiEdit">',
		'<a title="修改" href="share.html?shareID={id}" target="_self">改</a>',
		'<a title="删除" href="/ajax/del?from=share&id={id}" onclick="if(!confirm(\'三思啊，删了可就没啦！\')){return false;}" target="_self">删</a>',
	'</td>',
	'<td class="arLiTime">{time_show}</td>',
'</tr>'];

exports.render = function (req,res_this){

	var parm = {'url_base':'/admin/share/shareList.html'};
		parm['page_cur'] = req.url.split('?')[1] || 1;
		parm['page_list_num'] = 10 ;
	parm['page_cur'] = parseInt(parm['page_cur']);
	var skip_list=parm['page_list_num']*(parm['page_cur']-1);
	
	var method = mongo.start();
		
	method.open({'collection_name':'share'},function(err,collection){

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
			var tpl = fs.readFileSync('./templates/admin/share/shareList.html', "utf8");
			var pageTpl = page.render(parm);
			tpl = tpl.replace('{pageBar}',pageTpl);
		
			tpl = tpl.replace('{content}',txt);
			
			res_this.html(200,tpl);

			method.close();
		});
	});
}
