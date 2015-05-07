/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

/**
 * 发布博文
 */
define(function(require,exports){
	require('admin/publish/mditor.js');
	var formToAjax = require('admin/tools/form2ajax.js'),
      gallery = require('admin/gallery/index.js');
	//初始化模版
	function valueInit(tpl,data){
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	};
	var article_tpl = ['<div class="pub_article"><form action="/ajax/add_edit" method="post" target="_self">',
		'<br/><div class="input-group">',
  			'<span class="input-group-addon">标题</span>',
  			'<input type="text" class="form-control" placeholder="博文标题，必须要填的哦！" name="title" value="{title}"/>',
		'</div>',
		'<br/><div class="input-group">',
			'<span class="input-group-addon">简介</span>',
			'<textarea class="form-control" placeholder="一段话概括博文" name="intro" cols="50" rows="5">{intro}</textarea>',
		'</div>',
		'<br/><textarea class="mditor" placeholder="博文正文" name="content">{content}</textarea>',
		'<br/><div class="input-group">',
  			'<span class="input-group-addon">缩略图</span>',
  			'<input type="text" class="form-control" placeholder="缩略图" name="cover" value="{cover}" />',
  			'<a href="javascript:void(0)" class="input-group-addon pub_cover_btn">选择</a>',
		'</div>',
		'<br/><div>',
			'<div class="col-md-4">',
				'<div class="input-group">',
					'<span class="input-group-addon">$</span>',
					'<input type="text" class="form-control" placeholder="标签" name="tags" value="{tags}" />',
				'</div>',
			'</div>',
			'<div class="col-md-4">',
				'<div class="input-group">',
					'<span class="input-group-addon">$</span>',
					'<input type="text" class="form-control" placeholder="作者" name="author" value="{author}" />',
				'</div>',
			'</div>',
			'<div class="col-md-4">',
				'<div class="input-group">',
					'<span class="input-group-addon">$</span>',
					'<input type="text" class="form-control" placeholder="发表时间" name="time_show" value="{time_show}" />',
				'</div>',
			'</div>',
		'</div>',
		'<br/><div class="pub_sub">',
			'<input type="hidden" name="id" value="{id}" />',
			'<input type="hidden" name="category" value="blog" />',
			'<button type="submit" class="btn btn-primary">提交</button>',
		'</div>',
	'</form></div>'].join('');
	
	/****
	 * 获取博文内容
	 */
	function getArticle(id,callback){
		if(!id){
			callback && callback('missing arguments');
		}
		$.ajax({
			'url' : '/ajax/blog',
			'type' : 'GET',
			'data' : {
				'content_format' : 'markdown',
				'act' : 'get_detail',
				'id' : id
			},
			'success' : function(data){
				if(data.code != 200){
					callback && callback('data error');
				}else{
					callback && callback(null,data.detail);
				}	
			}
		});
	}
	//处理博文模块
	function article_handule(dom,data,sendFn){
		var new_html = valueInit(article_tpl,data);
		dom.html(new_html);
		new mditor(dom.find('textarea.mditor')[0]);
		dom.find('.pub_cover_btn').click(function(){
			gallery.pop(function(files){
				if(files && files.length>0){
					var path = files[0]['path'];
					dom.find('input[name="cover"]').val(path);
				}
			});
		});
		
		new formToAjax(dom,{
			onSubmit : function(data){
				UI.prompt('正在提交博文修改！');
			},
			onResponse : function(data){
				UI.prompt('博文修改完毕');
				sendFn && sendFn();
			}
		});
	}
	//发布帖子
	function ARTICLE(dom,id,sendFn){
		if(!id){
			article_handule(dom,{},sendFn);
			return
		}
		getArticle(id,function(err,data){
			if(err){
				dom.html('数据异常！');
				return
			}
			article_handule(dom,data,sendFn);
		});
	}
	
	return ARTICLE;
});