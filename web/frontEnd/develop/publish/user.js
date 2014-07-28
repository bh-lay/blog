/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
//alert(window.outerWidth);

/**
 * 发布分享
 */
define(function(require,exports){

	//初始化模版
	function valueInit(tpl,data){
			
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	};
	
	var share_tpl = ['<div class="pub_share">',
				/*<li class="L_foUItem"><label class="L_foUItTitle">：</label><input type="text" name="" value="{email}" /></li>
				<li class="L_foUItem"><label class="L_foUItTitle">：</label><input type="text" name="" ></li>
				<li class="L_foUItem"><label class="L_foUItTitle">：</label><select name="">{user_group}</select></li>
				<li class="L_foUItem"><input type="hidden" name="id" value="{id}" /><input type="submit" value="提交" /></li>
				**/
		'<form action="/ajax/user" method="post" target="_self">',
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
				'<input type="text" placeholder="用户组" name="user_group" value="{user_group}"/>',
			'</div>',
			'<div>',
				'<input type="hidden" name="id" value="{id}" />',
				'<input type="hidden" name="category" value="share" />',
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
			'url' : '/ajax/user/' + id,
			'type' : 'GET',
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
	function SHARE(dom,id){
		if(!id){
			var new_html = valueInit(share_tpl,{});
			
			dom.html(new_html);
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交用户创建！');
				},
				'onResponse' : function(data){
					UI.prompt('用户创建完毕');
					admin.push('/admin/');
					admin.refresh();
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
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交用户修改！');
				},
				'onResponse' : function(data){
					UI.prompt('用户修改完毕');
					admin.push('/admin/');
					admin.refresh();
				}
			});
		});
	}
	
	return SHARE;
});