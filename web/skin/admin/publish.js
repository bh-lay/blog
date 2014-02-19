/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
//alert(window.outerWidth);

window.admin = window.admin || {};
window.admin.publish = window.admin.publish || {};

(function(exports){
	var publish_tpl = ['<div class="publish">',
		'<div class="publish_cpt">',
			'<a href="javascript:void(0)" data-type="article" class="active">博文</a>',
			'<a href="javascript:void(0)" data-type="share">分享</a>',
			'<a href="javascript:void(0)" data-type="labs">实验室</a>',
			'<a href="javascript:void(0)" data-type="opus">作品</a>',
			'<a href="javascript:void(0)" data-type="friends">友情链接</a>',
		'</div>',
		'<div class="publish_cnt"></div>',
	'</div>'].join('');
	
	function show_module (dom,cpt_dom,name,id){
		if(name == 'share'){
			admin.publish.share(dom,id);
		}else if(name == 'opus'){
			admin.publish.opus(dom,id);
		}else if(name == 'friends'){
			admin.publish.friends(dom,id);
		}else if(name == 'labs'){
			admin.publish.labs(dom,id);
		}else{
			//默认为发布文章
			admin.publish.article(dom,id);
		}
	
		cpt_dom.find('a').removeClass('active');
		cpt_dom.find('a[data-type="' + name + '"]').addClass('active');
	
	}
	exports.init = function(dom,param){
		dom.html(publish_tpl);
		var cpt_dom = dom.find('.publish_cpt');
		var cnt_dom = dom.find('.publish_cnt');
		
		var param = param || {};
		var id = param.id || null;
		var active = param.active || 'article';
		show_module(cnt_dom,cpt_dom,active,id);
		cpt_dom.on('click','a',function(){
			var name = $(this).attr('data-type');
			show_module(cnt_dom,cpt_dom,name,null);
			admin.push('publish/' + name);
		});
	};
})(window.admin.publish);

(function(exports){
	var article_tpl = ['<div class="pub_article"><form action="/ajax/add_edit" method="post" target="_self">',
		'<div class="pub_arti_title"><input type="text" placeholder="博文标题，必须要填的哦！" name="title" value="{title}"/></div>',
		'<div class="pub_arti_intro">',
			'<textarea placeholder="一段话概括博文" name="intro" cols="50" rows="5">{intro}</textarea>',
		'</div>',
		'<div class="pub_arti_main">',
			'<textarea placeholder="博文正文" name="content">{content}</textarea>',
		'</div>',
		'<div>',
			'<input type="text" placeholder="缩略图" name="cover" value="{cover}" />',
			'<input type="text" placeholder="标签" name="tags" value="{tags}" />',
			'<input type="text" placeholder="作者" name="author" value="{author}" />',
			'<input type="text" placeholder="发表时间" name="time_show" value="{time_show}" />',
		'</div>',
		'<div class="pub_sub">',
			'<input type="hidden" name="id" value="{id}" />',
			'<input type="hidden" name="category" value="blog" />',
			'<input type="submit" value="提交" />',
		'</div>',
	'</form></div>'].join('');
	var share_tpl = ['<div class="pub_share">',
		'<form action="/ajax/add_edit" method="post" target="_self">',
			'<div class="pub_sha_title">',
				'<input type="text" placeholder="分享主题" name="title" value="{title}"/>',
			'</div>',
			'<div class="pub_sha_intro">',
				'<textarea name="intro" placeholder="分享简介" cols="50" rows="5">{intro}</textarea>',
			'</div>',
			'<div class="pub_sha_main">',
				'<textarea name="content" palceholder="分享详情" cols="50" rows="10" >{content}</textarea>',
			'</div>',
			'<div>',
				'<input type="text" placeholder="缩略图" name="cover" value="{cover}" />',
				'<input type="text" placeholder="标签" name="tags" value="{tags}" />',
				'<input type="text" placeholder="发表时间" name="time_show" value="{time_show}" />',
				'<input type="text" placeholder="分享来自" name="from" value="{from}" />',
				'<input type="text" placeholder="分享地址" name="from_url" value="{from_url}" />',
			'</div>',
			'<div>',
				'<input type="hidden" name="id" value="{id}" />',
				'<input type="hidden" name="category" value="share" />',
				'<input type="submit" value="提交" />',
			'</div>',
		'</form>',
	'</div>'].join('');
	var opus_tpl = ['<div class="L_formUI">',
		'<form action="/ajax/add_edit" method="post" target="_self"><ul>',
			'<li class="L_foUItem"><label class="L_foUItTitle">标题：</label><input type="text" name="title" value="{title}"/></li>',
			'<li class="L_foUItem"><label class="L_foUItTitle">缩略图：</label><input type="text" name="cover" value="{cover}"` /></li>',
			'<li class="L_foUItem"><label class="L_foUItTitle">作品大图：</label><input type="text" name="opus_pic" value="{opus_pic}" /></li>',
			'<li class="L_foUItem"><label class="L_foUItTitle">标签：</label><input type="text" name="tags" value="{tags}" /></li>',
			'<li class="L_foUItem"><label class="L_foUItTitle">创作时间：</label><input type="text" name="opus_time_create" value="{opus_time_create}" /></li>',
			'<li class="L_foUItem"><label class="L_foUItTitle">开发范围：</label><input type="text" name="work_range" value="{work_range}" /></li>',
			'<li class="L_foUItem"><label class="L_foUItTitle">在线地址：</label><input type="text" name="online_url" value="{online_url}" /></li>',
			'<li class="L_foUItem">',
				'<label class="L_foUItTitle">作品简介：</label>',
				'<textarea name="intro" cols="50" rows="5">{intro}</textarea>',
			'</li>',
			'<li class="L_foUItem">',
				'<label class="L_foUItTitle">作品详细：</label>',
				'<textarea name="content" cols="50" rows="10" >{content}</textarea>',
			'</li>',
			'<li class="L_foUItem">',
				'<input type="hidden" name="id" value="{id}" />',
				'<input type="hidden" name="category" value="opus" />',
				'<input type="submit" value="提交" />',
			'</li>',
		'</ul></form>',
	'</div>'].join('');
	
	var labs_tpl = ['<div class="L_formUI">',
		'<form action="/ajax/add_edit" method="post" target="_self"><ul>',
			'<li class="L_foUItem"><label class="L_foUItTitle">标题：</label><input type="text" name="title" value="{title}"/></li>',
			'<li class="L_foUItem"><label class="L_foUItTitle">缩略图：</label><input type="text" name="cover" value="{cover}"` /></li>',
			'<li class="L_foUItem"><label class="L_foUItTitle">创作时间：</label><input type="text" name="time_create" value="{opus_time_create}" /></li>',
			'<li class="L_foUItem">',
				'<label class="L_foUItTitle">插件简介：</label>',
				'<textarea name="intro" cols="50" rows="5">{intro}</textarea>',
			'</li>',
			'<li class="L_foUItem">',
				'<label class="L_foUItTitle">插件详细介绍：</label>',
				'<textarea name="content" cols="50" rows="10" >{content}</textarea>',
			'</li>',
			'<li class="L_foUItem">',
				'<input type="hidden" name="id" value="{id}" />',
				'<input type="hidden" name="category" value="labs" />',
				'<input type="submit" value="提交" />',
			'</li>',
		'</ul></form>',
	'</div>'].join('');
	
	var friend_tpl = ['<div class="L_formUI">',
		'<form action="/ajax/add_edit" method="post" target="_self"><ul>',
			'<li class="L_foUItem"><label class="L_foUItTitle">标题：</label><input type="text" name="title" value="{title}"/></li>',
			'<li class="L_foUItem"><label class="L_foUItTitle">地址：</label><input type="text" name="url" value="{url}" /></li>',
			'<li class="L_foUItem"><label class="L_foUItTitle">描述：</label><input type="text" name="discription" value="{discription}" /></li>',
			'<li class="L_foUItem"><label class="L_foUItTitle">是否显示：</label><input type="text" name="isShow" value="{isShow}" /></li>',
			'<li class="L_foUItem">',
				'<input type="hidden" name="id" value="{id}" />',
				'<input type="hidden" name="category" value="blog_friend" />',
				'<input type="submit" value="提交" />',
			'</li>',
		'</ul></form>',
	'</div>'].join('');
	
	var require = new loader({
		'mditor' : '/frontEnd/mditor/mditor.js'
	});
	
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

	/****
	 * 获取分享内容
	 */
	function getShare(id,callback){
		if(!id){
			callback && callback('missing arguments');
		}
		$.ajax({
			'url' : '/ajax/share',
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
	
	/****
	 * 获取友情链接内容
	 */
	function getFriend(id,callback){
		if(!id){
			callback && callback('missing arguments');
		}
		$.ajax({
			'url' : '/ajax/friends',
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
	function valueInit(tpl,data){
		var txt = tpl.replace(/\{(\w*)}/g,function(){
			return data[arguments[1]]||'';
		});
		return txt;
	}
	function article_handule(dom,data){
		var new_html = valueInit(article_tpl,data);
		dom.html(new_html);
		require.load('mditor',function(){
			mditor.bind(dom.find('.pub_arti_main textarea'));
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
	//发布分享
	function SHARE(dom,id){
		if(!id){
			var new_html = valueInit(share_tpl,{});
			
			dom.html(new_html);
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交分享修改！');
				},
				'onResponse' : function(data){
					UI.prompt('分享发布完毕');
					admin.push('/admin/');
					admin.refresh();
				}
			});
			return
		}
		getShare(id,function(err,data){
			if(err){
				dom.html('数据异常！');
				return
			}
			var new_html = valueInit(share_tpl,data);
			
			dom.html(new_html);
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交分享修改！');
				},
				'onResponse' : function(data){
					UI.prompt('分享修改完毕');
					admin.push('/admin/');
					admin.refresh();
				}
			});
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
			return
		}
		getLabs(id,function(err,data){
			if(err){
				dom.html('数据异常！');
				return
			}
			var new_html = valueInit(labs_tpl,data);
			
			dom.html(new_html);
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交分享修改！');
				},
				'onResponse' : function(data){
					UI.prompt('分享修改完毕');
					admin.push('/admin/');
					admin.refresh();
				}
			});
		});
	}
	function OPUS(dom,id){
		if(!id){
			var new_html = valueInit(opus_tpl,{});
			
			dom.html(new_html);
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交分享修改！');
				},
				'onResponse' : function(data){
					UI.prompt('分享发布完毕');
					admin.push('/admin/');
					admin.refresh();
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
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交作品修改！');
				},
				'onResponse' : function(data){
					UI.prompt('作品修改完毕');
					admin.push('/admin/');
					admin.refresh();
				}
			});
		});
	}
	
	//增加、修改友情链接
	function FRIENDS(dom,id){
		if(!id){
			var new_html = valueInit(friend_tpl,{});
			dom.html(new_html);
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在发布！');
				},
				'onResponse' : function(data){
					UI.prompt('链接发布完毕');
					admin.push('/admin/');
					admin.refresh();
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
			admin.formToAjax(dom,{
				'onSubmit' : function(data){
					UI.prompt('正在提交链接修改！');
				},
				'onResponse' : function(data){
					UI.prompt('链接修改完毕');
					admin.push('/admin/');
					admin.refresh();
				}
			});
		});
	}
	//对外接口
	exports.article = ARTICLE;
	exports.share = SHARE;
	exports.opus = OPUS;
	exports.friends = FRIENDS;
	exports.labs = LABS;
})(window.admin.publish);