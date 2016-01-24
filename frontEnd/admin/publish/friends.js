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
			gallery = require('gallery/index.js'),
			friend_tpl = __inline("tpl/friends.html");

	/****
	 * 获取友情链接内容
	 */
	function getFriend(id,callback){
		if(!id){
			callback && callback(null,{});
			return
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
		getFriend(id,function(err,data){
			if(err){
				dom.html('数据异常！');
				return
			}
			var new_html = juicer(friend_tpl,data),
				prompt;
			dom.html(new_html);
			dom.on('click','.pub_cover_btn',function(){
				var input = $(this).parent().find('input');
				gallery.pop(function(files){
					if(files && files.length>0){
						var path = files[0]['path'];
						input.val(path);
					}
				});
			});
			new formToAjax(dom,{
				'onSubmit' : function(data){
					prompt = UI.prompt('正在提交！',0);
				},
				'onResponse' : function(data){
					prompt.tips('完事儿！');
					sendFn && sendFn();
				}
			});
		});
	}

	//对外接口
	return FRIENDS;
});
