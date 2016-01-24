/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/


/**
 * 发布试验室
 */


define && define(function(require,exports){
	var formToAjax = require('tools/form2ajax.js'),
      gallery = require('gallery/index.js'),
      labs_tpl = __inline('tpl/labs.html');

	/****
	 * 获取实验室内容
	 */
	function getLabs(id,callback){
		if(!id){
			callback && callback('missing arguments');
		}
		$.ajax({
			'url' : '/ajax/labs',
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
	//发布实验室内容
	function LABS(dom,id,sendFn){
        dom.on('click','.pub_cover_btn',function(){
          var input = $(this).parent().find('input');
          gallery.pop(function(files){
            if(files && files.length>0){
              var path = files[0]['path'];
              input.val(path);
            }
          });
		});
		var alert;
		if(!id){
			var new_html = juicer(labs_tpl,{});

			dom.html(new_html);
			new formToAjax(dom,{
				'onSubmit' : function(data){
					alert = UI.prompt('正在发布实验室！',0);
				},
				'onResponse' : function(data){
					if(data && data.code == 200){
						alert.tips('实验室发布完毕');
					}else{
						alert.tips(data.msg || '实验室发布失败');
					}
					sendFn && sendFn();
				}
			});
			return
		}
		getLabs(id,function(err,data){
			if(err){
				dom.html('数据异常！');
				return
			}
			if(data.github){
			}
			var new_html = juicer(labs_tpl,data);

			dom.html(new_html);
			new formToAjax(dom,{
				'onSubmit' : function(data){
					alert = UI.prompt('正在提交实验室的修改！',0);
				},
				'onResponse' : function(data){
					if(data && data.code == 200){
						alert.tips('实验室修改完毕');
					}else{
						alert.tips(data.msg || '实验室修改失败');
					}
					sendFn && sendFn();
				}
			});
		});
	}

	return LABS;
});
