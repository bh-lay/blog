/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

/**
 * 发布友情链接
 */


define && define(function(require,exports){
	seajs.use('publish/publish.css');
	require('mditor/mditor.js');
	require('gallery/index.js');
	
	
	//初始化模版
	function valueInit(tpl,data){
			
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	};

	var friend_tpl = ['<div class="pub_friend">',
		'<form action="/ajax/add_edit" method="post" target="_self">',
			'<div class="pub_row_input"><input type="text" name="title" value="{title}" placeholder="标题" /></div>',
			'<div class="pub_row_input"><input type="text" name="url" value="{url}" placeholder="地址" /></div>',
			'<div class="pub_row_input"><input type="text" name="discription" value="{discription}" placeholder="描述" /></div>',
			'<div class="pub_row_input"><input type="text" name="isShow" value="{isShow}" placeholder="是否显示" /></div>',
			'<div class="pub_row_input">',
				'<input type="hidden" name="id" value="{id}" />',
				'<input type="hidden" name="category" value="blog_friend" />',
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
			'url' : '/ajax/friends',
			'type' : 'GET',
			'data' : {
				'act' : 'get_detail',
				'id' : id
			},
			'success' : function(data){
				if(data.code != 1){
					callback && callback('data error');
				}else{
					callback && callback(null,data.detail);
				}	
			}
		});
	}
	
	
	//增加、修改友情链接
	function FRIENDS(dom,id){
		if(!id){
			var new_html = valueInit(friend_tpl,{});
			dom.html(new_html);
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在发布！');
				},
				'onResponse' : function(data){
					UI.prompt('链接发布完毕');
					admin.push('/admin/');
					admin.refresh();
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
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交链接修改！');
				},
				'onResponse' : function(data){
					UI.prompt('链接修改完毕');
					admin.push('/admin/');
					admin.refresh();
				}
			});
		});
	}
	
	
	//对外接口
	return FRIENDS;
});