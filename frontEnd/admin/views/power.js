/**
 * 权限列表
 **/
define(function(exports){
	var userItem = ['<tr>',
		'<td>{id}</td>',
		'<td>{name}</td>',
		'<td>{discription}</td>',
		'<td>',
			'<a class="btn btn-default btn-xs custom-publish" href="javascript:void(0)" data-type="power" data-id="{id}"><span class="glyphicon glyphicon-edit"></span></a>',
			'<a class="btn btn-default btn-xs" title="删除" href="/ajax/del?from=power&id={id}" data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span class="glyphicon glyphicon-remove"></span></a>',
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
	
	function powerList(dom){
		$.ajax({
			'url' : '/ajax/power',
			'data' : {
				'act' : 'get_list',
				'limit' : 60
			},
			'success' : function(d){
				var html = ['<div class="col-md-12 custom-mb10">',
					'<a href="/admin/publish/power" class="btn btn-primary btn-sm custom-lofox" role="button">加权限</a>',
				'</div>',
				'<div class="col-md-12">',
					'<div class="panel panel-default">',
						'<table class="table table-hover custom-listTable">',
						'<tr><th>#</th><th>权限名</th><th>权限描述</th><th>操作</th></tr>'].join('');
				html += render(userItem,d.list);
				html += '</table></div></div>';
				dom.html(html);
			},
			'error' : function(){
				dom.html('error');
			}
		})
	}
	return powerList;
});