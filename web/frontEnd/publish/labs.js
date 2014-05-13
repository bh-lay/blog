/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/


/**
 * 发布试验室
 */


define && define(function(require,exports){
	require('/frontEnd/publish/publish.css');
	require('/frontEnd/mditor/mditor.js');
	require('/frontEnd/gallery/index.js');
	
		//初始化模版
	function valueInit(tpl,data){
			
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	};
	
	var labs_tpl = ['<div class="pub_labs">',
		'<form action="/ajax/add_edit" method="post" target="_self">',
			'<div class="pub_row_input"><input type="text" name="name" value="{name}" placeholder="插件名"/></div>',
			'<div class="pub_row_input"><input type="text" name="title" value="{title}" placeholder="标题"/></div>',
			'<div class="pub_row_input"><input type="text" name="cover" value="{cover}" placeholder="缩略图" /></div>',
			'<div class="pub_row_input"><input type="text" name="time_create" value="{opus_time_create}" placeholder="创作时间" /></div>',
			'<div class="pub_row_input">',
				'<textarea name="intro" cols="50" rows="5" placeholder="插件简介">{intro}</textarea>',
			'</div>',
			'<div class="pub_row_input"><input type="text" name="git_full_name" value="{git_full_name}" placeholder="github地址（如“bh-lay/uploader”）" /></div>',
			'<div class="pub_row_input"><input type="text" name="demo_url" value="{demo_url}" placeholder="demo地址" /></div>',
			'<div class="pub_row_input">',
				'<textarea class="mditor" name="content" cols="50" rows="10" placeholder="插件详细介绍" >{content}</textarea>',
			'</div>',
			'<div>',
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
				if(data.code != 1){
					callback && callback('data error');
				}else{
					callback && callback(null,data.detail);
				}	
			}
		});
	}
	//发布实验室内容
	function LABS(dom,id){
		if(!id){
			var new_html = valueInit(labs_tpl,{});
			
			dom.html(new_html);
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交实验室的修改！');
				},
				'onResponse' : function(data){
					UI.prompt('实验室发布完毕');
					admin.push('/admin/');
					admin.refresh();
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
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交实验室修改！');
				},
				'onResponse' : function(data){
					UI.prompt('实验室修改完毕');
					admin.push('/admin/');
					admin.refresh();
				}
			});
		});
	}
	
	return LABS;
});