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
	require('publish/publish.css');
	require('mditor/mditor.js');
	require('gallery/index.js');

	//初始化模版
	function valueInit(tpl,data){
			
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	};
	
	var share_tpl = ['<div class="pub_share">',
		'<form action="/ajax/add_edit" method="post" target="_self">',
			'<div class="pub_row_input">',
				'<input type="text" placeholder="分享主题" name="title" value="{title}"/>',
			'</div>',
			'<div class="pub_row_input">',
				'<textarea name="intro" placeholder="分享简介" cols="50" rows="5">{intro}</textarea>',
			'</div>',
			'<div class="pub_row_input">',
				'<textarea name="content" placeholder="分享详情" cols="50" rows="10" >{content}</textarea>',
			'</div>',
			'<div>',
				'<input type="text" placeholder="缩略图" name="cover" value="{cover}" />',
				'<input type="text" placeholder="标签" name="tags" value="{tags}" />',
				'<input type="text" placeholder="发表时间" name="time_show" value="{time_show}" />',
				'<input type="text" placeholder="分享来自" name="from" value="{from}" />',
				'<input type="text" placeholder="分享地址" name="from_url" value="{from_url}" />',
			'</div>',
			'<div>',
				'<input type="hidden" name="id" value="{id}" />',
				'<input type="hidden" name="category" value="share" />',
				'<button type="submit" class="btn btn-primary">提交</button>',
			'</div>',
		'</form>',
	'</div>'].join('');
	/****
	 * 获取分享内容
	 */
	function getShare(id,callback){
		if(!id){
			callback && callback('missing arguments');
		}
		$.ajax({
			'url' : '/ajax/share',
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
	//发布分享
	function SHARE(dom,id){
		if(!id){
			var new_html = valueInit(share_tpl,{});
			
			dom.html(new_html);
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交分享修改！');
				},
				'onResponse' : function(data){
					UI.prompt('分享发布完毕');
					admin.push('/admin/');
					admin.refresh();
				}
			});
			return
		}
		getShare(id,function(err,data){
			if(err){
				dom.html('数据异常！');
				return
			}
			var new_html = valueInit(share_tpl,data);
			
			dom.html(new_html);
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交分享修改！');
				},
				'onResponse' : function(data){
					UI.prompt('分享修改完毕');
					admin.push('/admin/');
					admin.refresh();
				}
			});
		});
	}
	
	return SHARE;
});