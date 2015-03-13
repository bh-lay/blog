/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
//alert(window.outerWidth);


/**
 * 发布作品
 */

define && define(function(require,exports){
	require('mditor/mditor.js');
	
	
	//初始化模版
	function valueInit(tpl,data){
			
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	}
	
	var opus_tpl = ['<div class="pub_opus">',
		'<form action="/ajax/add_edit" method="post" target="_self">',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">标题</span>',
				'<input type="text" class="form-control" name="title" value="{title}" placeholder="标题">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">开发范围</span>',
				'<input type="text" class="form-control" name="work_range" value="{work_range}" placeholder="开发范围">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">在线地址</span>',
				'<input type="text" class="form-control" name="online_url" value="{online_url}" placeholder="在线地址">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">简介</span>',
				'<textarea class="form-control" name="intro" cols="50" rows="5" placeholder="作品简介">{intro}</textarea>',
			'</div>',
			'<br/><textarea class="mditor" name="content" cols="50" rows="10" placeholder="作品详细信息" >{content}</textarea>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">缩略图</span>',
				'<input type="text" class="form-control" name="cover" value="{cover}" placeholder="缩略图">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">大图</span>',
				'<input type="text" class="form-control" name="opus_pic" value="{opus_pic}" placeholder="作品大图">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">标签</span>',
				'<input type="text" class="form-control" name="tags" value="{tags}" placeholder="标签">',
			'</div>',
			'<br/><div class="input-group">',
				'<span class="input-group-addon">创作时间</span>',
				'<input type="text" class="form-control" name="opus_time_create" value="{opus_time_create}" placeholder="创作时间">',
			'</div>',
			'<br/><div>',
				'<input type="hidden" name="id" value="{id}" />',
				'<input type="hidden" name="category" value="opus" />',
				'<button type="submit" class="btn btn-primary">提交</button>',
			'</div>',
		'</form>',
	'</div>'].join('');
	/****
	 * 获取作品内容
	 */
	function getOpus(id,callback){
		if(!id){
			callback && callback('missing arguments');
		}
		$.ajax({
			'url' : '/ajax/opus',
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
	function OPUS(dom,id,sendFn){
		if(!id){
			var new_html = valueInit(opus_tpl,{});
			
			dom.html(new_html);
			new mditor(dom.find('textarea.mditor')[0]);
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交分享修改！',0);
				},
				'onResponse' : function(data){
					if(data && data.code == 200){
						UI.prompt('分享发布完毕');
					}else{
						UI.prompt(data.msg || '分享发布失败');
					}
					sendFn && sendFn();
				}
			});
			return
		}
		getOpus(id,function(err,data){
			if(err){
				dom.html('数据异常！');
				return
			}
			var new_html = valueInit(opus_tpl,data);
			
			dom.html(new_html);
			new mditor(dom.find('textarea.mditor')[0]);
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交作品修改！');
				},
				'onResponse' : function(data){
					UI.prompt('作品修改完毕');
					sendFn && sendFn();
				}
			});
		});
	}

	return OPUS;
});