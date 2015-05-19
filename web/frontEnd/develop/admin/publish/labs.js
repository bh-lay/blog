/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/


/**
 * 发布试验室
 */


define && define(function(require,exports){
	require('admin/publish/mditor.js');
	require('admin/gallery/index.js');
	var formToAjax = require('admin/tools/form2ajax.js'),
      gallery = require('admin/gallery/index.js');
	
		//初始化模版
	function valueInit(tpl,data){
			
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	};
	
	var labs_tpl = ['<div class="pub_labs">',
		'<form action="/ajax/add_edit" method="post" target="_self">',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">插件名</span>',
				'<input type="text" class="form-control" name="name" value="{name}" placeholder="插件名">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">标题</span>',
				'<input type="text" class="form-control" name="title" value="{title}" placeholder="标题">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">缩略图</span>',
				'<input type="text" class="form-control" name="cover" value="{cover}" placeholder="缩略图">',
                '<a href="javascript:void(0)" class="input-group-addon pub_cover_btn">选择</a>',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">创作时间</span>',
				'<input type="text" class="form-control" name="time_create" value="{time_create}" placeholder="创作时间">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">简介</span>',
				'<textarea class="form-control" name="intro" cols="50" rows="5" placeholder="插件简介">{intro}</textarea>',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">github</span>',
				'<input type="text" class="form-control" name="git_full_name" value="{git_full_name}" placeholder="github地址（如“bh-lay/uploader”）">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">demo</span>',
				'<input type="text" class="form-control" name="demo_url" value="{demo_url}" placeholder="demo地址">',
			'</div>',
			'<br/><div class="input-group" style="width:100%">',
				'<textarea class="form-control mditor" name="content" cols="50" rows="10" placeholder="插件详细介绍" >{content}</textarea>',
			'</div>',
			'<br/><div>',
				'<input type="hidden" name="id" value="{id}" />',
				'<input type="hidden" name="category" value="labs" />',
				'<button type="submit" class="btn btn-primary">提交</button>',
			'</div>',
		'</form>',
	'</div>'].join('');
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
			var new_html = valueInit(labs_tpl,{});
			
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
			mditor.bind(dom.find('textarea.mditor'));
			return
		}
		getLabs(id,function(err,data){
			if(err){
				dom.html('数据异常！');
				return
			}
			var new_html = valueInit(labs_tpl,data);
			
			dom.html(new_html);
			mditor.bind(dom.find('textarea.mditor'));
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