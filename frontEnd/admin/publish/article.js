/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

/**
 * 发布博文
 */
define(function(require,exports){
	require('mditor.js');
	var formToAjax = require('tools/form2ajax.js'),
		article_tpl = __inline("tpl/article.html"),
		gallery = require('gallery/index.js');
	//初始化模版
	function valueInit(tpl,data){
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	};
	
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