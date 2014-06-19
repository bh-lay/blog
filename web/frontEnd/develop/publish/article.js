/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

/**
 * 发布博文
 */
define(function(require,exports){
	seajs.use('publish/publish.css');
	require('mditor/mditor.js');
	var gallery = require('gallery/index.js');
	//初始化模版
	function valueInit(tpl,data){
			
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	};
	var article_tpl = ['<div class="pub_article"><form action="/ajax/add_edit" method="post" target="_self">',
		'<div class="pub_row_input"><input type="text" placeholder="博文标题，必须要填的哦！" name="title" value="{title}"/></div>',
		'<div class="pub_row_input">',
			'<textarea placeholder="一段话概括博文" name="intro" cols="50" rows="5">{intro}</textarea>',
		'</div>',
		'<div class="pub_row_input">',
			'<textarea class="mditor" placeholder="博文正文" name="content">{content}</textarea>',
		'</div>',
		'<div class="pub_row_image">',
			'<div class="pub_row_image" style="background-image:url({cover});">',
				'<a class="pub_cover_btn" href="javascript:void(0)">选择</a>',
			'</div>',
			'<input type="hidden" placeholder="缩略图" name="cover" value="{cover}" />',
		'</div>',
		'<div>',
			'<input type="text" placeholder="标签" name="tags" value="{tags}" />',
			'<input type="text" placeholder="作者" name="author" value="{author}" />',
			'<input type="text" placeholder="发表时间" name="time_show" value="{time_show}" />',
		'</div>',
		'<div class="pub_sub">',
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
				if(data.code != 1){
					callback && callback('data error');
				}else{
					callback && callback(null,data.detail);
				}	
			}
		});
	}
	//处理博文模块
	function article_handule(dom,data){
		var new_html = valueInit(article_tpl,data);
		dom.html(new_html);
		mditor.bind(dom.find('textarea.mditor'));
		dom.find('.pub_cover_btn').click(function(){
			gallery.pop(function(files){
				if(files && files.length>0){
					var url = files[0]['url'];
					dom.find('.pub_row_image').css('backgroundImage','url(' + url + ')');
					dom.find('input[name="cover"]').val(url);
				}
			});
		});
		
		admin.formToAjax(dom,{
			'onSubmit' : function(data){
				UI.prompt('正在提交博文修改！');
			},
			'onResponse' : function(data){
				UI.prompt('博文修改完毕');
				admin.push('/admin/');
				admin.refresh();
			}
		});
	}
	//发布帖子
	function ARTICLE(dom,id){
		if(!id){
			article_handule(dom,{});
			return
		}
		getArticle(id,function(err,data){
			if(err){
				dom.html('数据异常！');
				return
			}
			article_handule(dom,data);
		});
	}
	
	return ARTICLE;
});