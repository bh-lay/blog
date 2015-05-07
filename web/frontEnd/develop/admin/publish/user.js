/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

define(function(require,exports){

	var formToAjax = require('admin/tools/form2ajax.js');
	//初始化模版
	function valueInit(tpl,data){
			
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	};
	
	var share_tpl = ['<div>',
		'<form action="/ajax/user/add_edit" method="post" target="_self">',
			'<div class="pub_row_input">',
				'<input type="text" placeholder="用户名" name="username" value="{username}"/>',
			'</div>',
			'<div class="pub_row_input">',
				'<input type="text" placeholder="邮箱" name="email" value="{email}"/>',
			'</div>',
			'<div class="pub_row_input">',
				'<input type="text" placeholder="密码" name="password" />',
			'</div>',
			'<div class="pub_row_input">',
				'<input type="text" placeholder="头像" name="avatar" value="{avatar}"/>',
			'</div>',
			'<div class="pub_row_input">',
				'<input type="text" placeholder="用户组" name="user_group" value="{user_group}"/>',
			'</div>',
			'<div>',
				'<input type="hidden" name="id" value="{id}" />',
				'<button type="submit" class="btn btn-primary">提交</button>',
			'</div>',
		'</form>',
	'</div>'].join('');
	/****
	 * 获取用户信息
	 */
	function getUser(id,callback){
		if(!id){
			callback && callback('missing arguments');
		}
		$.ajax({
			'url' : '/ajax/user/detail',
			'data' : {
				'uid' : id
			},
			'type' : 'POST',
			'success' : function(data){
				if(data.code != 200){
					callback && callback('data error');
				}else{
					callback && callback(null,data.detail);
				}	
			}
		});
	}
	//用户模块
	return function(dom,id,sendFn){
		var alert;
		if(!id){
			var new_html = valueInit(share_tpl,{});
			
			dom.html(new_html);
			new formToAjax(dom,{
				'onSubmit' : function(data){
					alert = UI.prompt('正在提交用户创建！',0);
				},
				'onResponse' : function(data){
					if(data && data.code == 200){
						alert.tips('用户创建完毕');
					}else{
						alert.tips(data.msg || '用户创建失败');
					}
					sendFn && sendFn();
				}
			});
			return
		}
		getUser(id,function(err,data){
			if(err){
				dom.html('数据异常！');
				return
			}
			var new_html = valueInit(share_tpl,data);
			
			dom.html(new_html);
			new formToAjax(dom,{
				'onSubmit' : function(data){
					alert = UI.prompt('正在提交用户修改！');
				},
				'onResponse' : function(data){
					if(data && data.code == 200){
						alert.tips('用户修改完毕');
					}else{
						alert.tips(data.msg || '用户修改失败');
					}
					sendFn && sendFn();
				}
			});
		});
	};
});