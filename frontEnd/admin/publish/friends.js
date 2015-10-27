/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

/**
 * 发布友情链接
 */


define && define(function(require,exports){
	var formToAjax = require('tools/form2ajax.js'),
		friend_tpl = __inline("tpl/friends.html");
  
	//初始化模版
	function valueInit(tpl,data){
			
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	};
	
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