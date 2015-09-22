/**
 * 用户列表
 **/
define(function(){
	var userItem = ['<tr>',
		'<td>{username}</td>',
		'<td>{email}</td>',
		'<td>{user_group}</td>',
		'<td>',
			'<a class="btn btn-default btn-xs custom-publish"  href="javascript:void(0)" data-type="user" data-id="{id}"><span class="glyphicon glyphicon-edit"></span></a>',
			'<a class="btn btn-default btn-xs" title="删除" href="/ajax/del?from=user&id={id}" data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span class="glyphicon glyphicon-remove"></span></a>',
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
	
	function userList(dom){
		$.ajax({
			'url' : '/ajax/user/list',
			'success' : function(d){
				var html = ['<div class="col-md-12 custom-mb10">',
					'<a href="/admin/publish/user" class="btn btn-primary btn-sm custom-lofox" role="button">增加用户</a>',
				'</div>',
				'<div class="col-md-12">',
					'<div class="panel panel-default">',
						'<table class="table table-hover">',
						'<tr><th>标题</th><th>邮箱</th><th>用户组</th><th>操作</th></tr>'].join('');
				html += render(userItem,d.list);
				html += '</table></div></div>';
				dom.html(html);
			},
			'error' : function(){
				dom.html('error');
			}
		})
	}
	return userList;
});