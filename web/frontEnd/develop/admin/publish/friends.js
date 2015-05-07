/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

/**
 * 发布友情链接
 */


define && define(function(require,exports){
	var formToAjax = require('admin/tools/form2ajax.js');
  
	//初始化模版
	function valueInit(tpl,data){
			
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	};

	var friend_tpl = ['<div class="pub_friend">',
		'<form action="/ajax/links/add_edit" method="post" target="_self">',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">标题</span>',
				'<input type="text" class="form-control" name="title" value="{title}" placeholder="标题">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">地址</span>',
				'<input type="text" class="form-control" name="url" value="{url}" placeholder="地址">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">描述</span>',
				'<input type="text" class="form-control" name="discription" value="{discription}" placeholder="描述">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">Github用户名</span>',
				'<input type="text" class="form-control" name="github_username" value="{github_username}" placeholder="Github用户名">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">是否显示</span>',
				'<input type="text" class="form-control" name="isShow" value="{isShow}" placeholder="1 显示，0不显示 ">',
			'</div>',
			'<br/><div class="pub_row_input">',
				'<input type="hidden" name="id" value="{id}" />',
				'<button type="submit" class="btn btn-primary">提交</button>',
			'</div>',
		'</form>',
	'</div>'].join('');
	
	
	/****
	 * 获取友情链接内容
	 */
	function getFriend(id,callback){
		if(!id){
			callback && callback('missing arguments');
		}
		$.ajax({
			url : '/ajax/links/detail/' + id,
			type : 'GET',
			success : function(data){
				if(data.code != 200){
					callback && callback('data error');
				}else{
					callback && callback(null,data.detail);
				}	
			}
		});
	}
	
	
	//增加、修改友情链接
	function FRIENDS(dom,id,sendFn){
		if(!id){
			var new_html = valueInit(friend_tpl,{});
			dom.html(new_html);
			new formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在发布！');
				},
				'onResponse' : function(data){
					UI.prompt('链接发布完毕');
					sendFn && sendFn();
				}
			});
			return
		}
		getFriend(id,function(err,data){
			if(err){
				dom.html('数据异常！');
				return
			}
			var new_html = valueInit(friend_tpl,data);
			dom.html(new_html);
			new formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交链接修改！');
				},
				'onResponse' : function(data){
					UI.prompt('链接修改完毕');
					sendFn && sendFn();
				}
			});
		});
	}
	
	
	//对外接口
	return FRIENDS;
});