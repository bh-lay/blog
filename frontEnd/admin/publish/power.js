/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/



/**
 * 发布权限
 */

define && define(function(require,exports){
	
	var formToAjax = require('tools/form2ajax.js');
	//初始化模版
	function valueInit(tpl,data){
			
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	};
	
	/****
	 * 获取权限内容
	 */
	function getPower(id,callback){
		if(!id){
			callback && callback('missing arguments');
		}
		$.ajax({
			'url' : '/ajax/power',
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
	
	
	/**
	 * 权限
	 **/
	var power_tpl = ['<form action="/ajax/power/add_edit" method="post" target="_self"><ul>',
		'<li class="L_foUItem"><label class="L_foUItTitle">权限编号：</label><input type="text" name="id" value="{id}"/></li>',
		'<li class="L_foUItem"><label class="L_foUItTitle">权限名：</label><input type="text" name="name" value="{name}" /></li>',
		'<li class="L_foUItem"><label class="L_foUItTitle">权限描述：</label><input type="text" name="discription" value="{discription}" ></li>',
		'<li class="L_foUItem"><input type="submit" value="提交" /></li>',
	'</ul></form>'].join('');
	
	//发布权限内容
	function POWER(dom,id,sendFn){
		if(!id){
			var new_html = valueInit(power_tpl,{});
			
			dom.html(new_html);
			new formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交权限的创建！');
				},
				'onResponse' : function(data){
					UI.prompt('权限修改完毕');
					sendFn && sendFn();
				}
			});
			return
		}
		getPower(id,function(err,data){
			if(err){
				dom.html('数据异常！');
				return
			}
			var new_html = valueInit(power_tpl,data);
			
			dom.html(new_html);
			new formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交权限的修改！');
				},
				'onResponse' : function(data){
					UI.prompt('权限修改完毕');
					sendFn && sendFn();
				}
			});
		});
	}
	
	//对外接口
	return POWER;
});