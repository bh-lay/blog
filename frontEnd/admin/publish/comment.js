/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

define(function(require,exports){

	var formToAjax = require('tools/form2ajax.js'),
		comment_tpl = __inline('tpl/comment.html');
	
	/****
	 * 获取评论数据
	 */
	function getComment(id,callback){
		if(!id){
			callback && callback(null,{});
			return
		}
		$.ajax({
			'url' : '/ajax/comments/detail',
			'data' : {
				'_id' : id
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
	return function(dom,cid,sendFn){
		getComment(cid,function(err,data){
			if(err){
				dom.html('数据异常！');
				return
			}
			var prompt,
				new_html = juicer(comment_tpl,data);
			console.log(data);
			dom.html(new_html);
			new formToAjax(dom,{
				'onSubmit' : function(data){
					prompt = UI.prompt('正在提交！');
				},
				'onResponse' : function(data){
					if(data && data.code == 200){
						prompt.tips('完事儿了！');
					}else{
						prompt.tips(data.msg || '坏了，失败了！');
					}
					sendFn && sendFn();
				}
			});
		});
	};
});