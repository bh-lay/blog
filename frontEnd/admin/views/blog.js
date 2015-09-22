/**
 * 博文列表页
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
define(function(require){
  var pageList = require('tools/pageList.js'),
      parseTime = require('tools/parseTime.js');
	var tpl = ['<tr>',
		'<td><a title="查看博文" href="/blog/{id}" target="_blank">{title}</a></td>',
		'<td>{time_show}</td>',
		'<td>',
			'<a class="btn btn-default btn-xs custom-publish" title="修改" href="javascript:void(0)" data-type="article" data-id="{id}"><span class="glyphicon glyphicon-edit"></span></a>',
			'<a class="btn btn-default btn-xs" title="删除" href="/ajax/del?from=blog&id={id}" data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span class="glyphicon glyphicon-remove"></span></a>',
		'</td>',
	'</tr>'].join('');
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	//获取文章列表
	function getList(start,limit,callback){
		$.ajax({
			url : '/ajax/blog',
			type : 'GET',
			data : {
				act : 'get_list',
				skip : start,
				limit : limit
			},
			success : function(data){
				for(var i in data.list){
					data.list[i].time_show = parseTime(data.list[i].time_show,'{y}-{m}-{d}');
				}
				callback(null,data);	
			}
		});
	}
	function listPage(dom){
		var list_html = ['<div class="col-md-12 custom-mb10">',
			'<a class="btn btn-default custom-publish" href="javascript:void(0)" data-type="article">写博文</a>',
		'</div>',
		'<div class="col-md-12">',
			'<div class="panel panel-default">',
				'<table class="table table-hover custom-listTable">',
					'<tr><th>标题</th><th>发布时间</th><th>操作</th></tr>'].join('');
		//每页显示条数
		var page_list_num = 8;
		getList(0,page_list_num,function(err,data){
			if(err){
				return
			}
			list_html += render(tpl,data.list);
			list_html += '</table></div></div>';
			
			list_html += '<div class="page col-md-12"></div>';
			dom.html(list_html);
			//分页组件
			var page = new pageList(dom.find('.page'),{
				list_count : data.count,
				page_cur : 0,
				page_list_num : page_list_num,
				max_page_btn : 5
			});
			page.jump = function(num){
				getList((num-1)*page_list_num,page_list_num,function(err,data){
					if(err){
						return
					}
					var new_html = render(tpl,data.list);
					dom.find('tr').eq(0).siblings().remove();
					dom.find('.table').append(new_html);
				});
			};
		});
	}
	return listPage;
});
