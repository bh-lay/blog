/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

window.admin = window.admin || {};
window.admin.render = window.admin.render || {};

/**
 * 首页
 **/
(function(exports){
	var txt = ['<div class="list-group">',
		'<a class="list-group-item" href="/admin/publish/article">写博文</a>',
		'<a class="list-group-item" href="/admin/publish/share">发分享</a>',
		'<a class="list-group-item" href="/admin/publish/labs">实验室</a>',
		'<a class="list-group-item" href="/admin/publish/opus">传作品</a>',
		'<a class="list-group-item" href="/admin/publish/friends">加友情链接</a>',
	'</div>',
	'<div class="list-group">',
		'<a class="list-group-item" href="/ajax/clear_cache?type=all">清除<strong>所有</strong>缓存</a>',
		'<a class="list-group-item" href="/ajax/clear_cache?type=chip">清除片段缓存</a>',
		'<a class="list-group-item" href="/ajax/clear_cache?type=ajax">清除ajax缓存</a>',
		'<a class="list-group-item" href="/ajax/clear_cache?type=html">清除页面缓存</a>',
	'</div>'].join('');
	function INDEX(dom){
		dom.html(txt);
	}
	exports.index = INDEX;
})(window.admin.render);

/**
 * 博文列表页
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
(function(exports){
	var tpl = ['<tr>',
		'<td><a title="查看博文" href="/blog/{id}" target="_blank">{title}</a></td>',
		'<td>{time_show}</td>',
		'<td>',
			'<a class="lofox" title="修改" href="/admin/publish/article/{id}" target="_self">改</a>--',
			'<a title="删除" href="/ajax/del?from=blog&id={id}" onclick="if(!confirm(\'三思啊，删了可就没啦！\')){return false;}" 	target="_self">删</a>',
		'</td>',
	'</tr>'].join('');
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	//获取文章列表
	function getList(start,limit,callback){
		$.ajax({
			'url' : '/ajax/blog',
			'type' : 'GET',
			'data' : {
				'act' : 'get_list',
				'skip' : start,
				'limit' : limit
			},
			'success' : function(data){
				for(var i in data.list){
					data.list[i].time_show = parse.time(data.list[i].time_show,'{y}-{m}-{d}');
				}
				callback(null,data);	
			}
		});
	}
	function listPage(dom){
		var list_html = ['<div class="row">',
			'<a href="/admin/publish/article" class="btn btn-primary btn-sm lofox" role="button">发博客</a>',
		'</div><br/>',
		'<div class="panel panel-default row">',
			'<table class="table table-hover">',
				'<tr><th>标题</th><th>发布时间</th><th>操作</th></tr>'].join('');
		//每页显示条数
		var page_list_num = 8;
		getList(0,page_list_num,function(err,data){
			if(err){
				console.log('error');
				return
			}
			list_html += render(tpl,data.list);
			list_html += '</table></div>';
			
			list_html += '<div class="page row"></div>';
			dom.html(list_html);
			//分页组件
			var page = admin.pageList(dom.find('.page'),{
				'list_count' : data.count,
				'page_cur' : 0,
				'page_list_num' : page_list_num
			});
			page.jump = function(num){
				//console.log(num,12);
				getList((num-1)*page_list_num,page_list_num,function(err,data){
					if(err){
						console.log('error');
						return
					}
					var new_html = render(tpl,data.list);
					dom.find('tr').eq(0).siblings().remove();
					dom.find('.table').append(new_html);
				});
			};
		});
	}
	exports.article = function(dom,id){
		listPage(dom);
	};
})(window.admin.render);


/**
 * 分享列表页
 * 分享内容页
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
(function(exports){
	var list_tpl = ['<tr>',
		'<td class="arLiTitle"><a title="查看分享" href="/share/{id}" target="_blank">{title}</a></td>',
		'<td class="arLiEdit">',
			'<a title="修改" href="/admin/publish/share/{id}" target="_self">改</a>',
			'<a title="删除" href="/ajax/del?from=share&id={id}" onclick="if(!confirm(\'三思啊，删了可就没啦！\')){return false;}" target="_self">删</a>',
		'</td>',
		'<td class="arLiTime">{time_show}</td>',
	'</tr>'].join('');
	
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	function getList(start,limit,callback){
		$.ajax({
			'url' : '/ajax/share',
			'type' : 'GET',
			'data' : {
				'act' : 'get_list',
				'skip' : start,
				'limit' : limit
			},
			'success' : function(data){
				for(var i in data.list){
					data.list[i].time_show = parse.time(data.list[i].time_show,'{y}-{m}-{d}');
				}
				callback(null,data);
			}
		});
	}
	function listPage(dom){
		var list_html = ['<div class="row">',
			'<a href="/admin/publish/share" class="btn btn-primary btn-sm lofox" role="button">发分享</a>',
		'</div><br/>',
		'<div class="panel panel-default row">',
			'<table class="table table-hover">',
				'<tr><th>标题</th><th>发布时间</th><th>操作</th></tr>'].join('');
				//每页显示条数
		var page_list_num = 10;
		getList(0,page_list_num,function(err,data){
			if(err){
				console.log('error');
				return
			}
			list_html += render(list_tpl,data.list);
			list_html += '</table></div>';
			
			list_html += '<div class="page row"></div>';
			dom.html(list_html);
			var page = admin.pageList(dom.find('.page'),{
				'list_count' : data.count,
				'page_cur' : 0,
				'page_list_num' : page_list_num
			});
			page.jump = function(num){
				//console.log(num,12);
				getList((num-1)*page_list_num,page_list_num,function(err,data){
					if(err){
						console.log('error');
						return
					}
					var new_html = render(list_tpl,data.list);
					dom.find('tr').eq(0).siblings().remove();
					dom.find('.table').append(new_html);
				});
			};
		});
	}
	exports.share = function(dom,id){
		//列表页
		listPage(dom);
	};
})(window.admin.render);



/**
 * 作品列表页
 * 作品内容页
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
(function(exports){
	var list_tpl = ['<tr>',
		'<td class="arLiTitle"><a title="查看作品" href="/share/{id}" target="_blank">{title}</a></td>',
		'<td class="arLiEdit">',
			'<a title="修改" href="/admin/publish/opus/{id}" target="_self">改</a>',
			'<a title="删除" href="/ajax/del?from=opus&id={id}" onclick="if(!confirm(\'三思啊，删了可就没啦！\')){return false;}" target="_self">删</a>',
		'</td>',
		'<td class="arLiTime">{time_show}</td>',
	'</tr>'].join('');
	
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	function getList(start,limit,callback){
		$.ajax({
			'url' : '/ajax/opus',
			'type' : 'GET',
			'data' : {
				'act' : 'get_list',
				'skip' : start,
				'limit' : limit
			},
			'success' : function(data){
				for(var i in data.list){
					data.list[i].time_show = parse.time(data.list[i].opus_time_create,'{y}-{m}-{d}');
				}
				callback(null,data);
			}
		});
	}
	function OPUS(dom){
		var list_html = ['<div class="row">',
			'<a href="/admin/publish/opus" class="btn btn-primary btn-sm lofox" role="button">发作品</a>',
		'</div><br/>',
		'<div class="panel panel-default row">',
			'<table class="table table-hover">',
				'<tr><th>标题</th><th>发布时间</th><th>操作</th></tr>'].join('');
				//每页显示条数
		var page_list_num = 10;
		getList(0,page_list_num,function(err,data){
			if(err){
				console.log('error');
				return
			}
			list_html += render(list_tpl,data.list);
			list_html += '</table></div>';
			
			list_html += '<div class="page"></div>';
			dom.html(list_html);
			var page = admin.pageList(dom.find('.page'),{
				'list_count' : data.count,
				'page_cur' : 0,
				'page_list_num' : page_list_num
			});
			page.jump = function(num){
				//console.log(num,12);
				getList((num-1)*page_list_num,page_list_num,function(err,data){
					if(err){
						console.log('error');
						return
					}
					var new_html = render(list_tpl,data.list);
					dom.find('tr').eq(0).siblings().remove();
					dom.find('.table').append(new_html);
				});
			};
		});
	}
	exports.opus = OPUS;
})(window.admin.render);


/**
 * 实验室列表页
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
(function(exports){
	var tpl = ['<tr>',
		'<td class="arLiTitle"><a title="查看博文" href="/labs/{id}" target="_blank">{title}</a></td>',
		'<td class="arLiEdit">',
			'<a class="lofox" title="修改" href="/admin/publish/labs/{id}" target="_self">改</a>',
			'<a title="删除" href="/ajax/del?from=labs&id={id}" onclick="if(!confirm(\'三思啊，删了可就没啦！\')){return false;}" 	target="_self">删</a>',
		'</td>',
		'<td class="arLiTime">{time_show}</td>',
	'</tr>'].join('');
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	//获取文章列表
	function getList(start,limit,callback){
		$.ajax({
			'url' : '/ajax/labs',
			'type' : 'GET',
			'data' : {
				'act' : 'get_list',
				'skip' : start,
				'limit' : limit
			},
			'success' : function(data){
				for(var i in data.list){
					data.list[i].time_show = parse.time(data.list[i].time_create,'{y}-{m}-{d}');
				}
				callback(null,data);	
			}
		});
	}
	function listPage(dom){
		var list_html = ['<div class="row">',
			'<a href="/admin/publish/opus" class="btn btn-primary btn-sm lofox" role="button">发作品</a>',
		'</div><br/>',
		'<div class="panel panel-default row">',
			'<table class="table table-hover">',
				'<tr><th>标题</th><th>发布时间</th><th>操作</th></tr>'].join('');
		//每页显示条数
		var page_list_num = 8;
		getList(0,page_list_num,function(err,data){
			if(err){
				console.log('error');
				return
			}
			list_html += render(tpl,data.list);
			list_html += '</table></div>';
			
			list_html += '<div class="page"></div>';
			dom.html(list_html);
			//分页组件
			var page = admin.pageList(dom.find('.page'),{
				'list_count' : data.count,
				'page_cur' : 0,
				'page_list_num' : page_list_num
			});
			page.jump = function(num){
				
				//console.log(num,12);
				getList((num-1)*page_list_num,page_list_num,function(err,data){
					if(err){
						console.log('error');
						return
					}
					var new_html = render(tpl,data.list);
					dom.find('tr').eq(0).siblings().remove();
					dom.find('.table').append(new_html);
				});
			};
		});
	}
	exports.labs = function(dom,id){
		listPage(dom);
	};
})(window.admin.render);


/**
 * 友情链接页面
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
(function(exports){
	var tpl = ['<tr>',
		'<td class="arLiTitle" title="{title}{url}">{title}</td>',
		'<td class="arLiTitle" title="添加时间">{time_create}</td>',
		'<td class="arLiEdit">',
			'<a title="修改" href="/admin/publish/friends/{id}" target="_self">改</a>',
			'<a title="删除" href="/ajax/del?from=blog_friend&id={id}" onclick="if(!confirm(\'三思啊，删了可就没啦！\')){return false;}" target="_self">删</a>',
		'</td>',
	'</tr>'].join('');
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	//获取友情链接列表
	function getList(start,limit,callback){
		$.ajax({
			'url' : '/ajax/friends',
			'type' : 'GET',
			'data' : {
				'act' : 'get_list',
				'skip' : start,
				'limit' : limit
			},
			'success' : function(data){
				for(var i in data.list){
					data.list[i].time_create = parse.time(data.list[i].time_create,'{y}-{m}-{d}');
				}
				callback(null,data);	
			}
		});
	}
	function listPage(dom){
		var list_html = ['<div class="row">',
			'<a href="/admin/publish/opus" class="btn btn-primary btn-sm lofox" role="button">发作品</a>',
		'</div><br/>',
		'<div class="panel panel-default row">',
			'<table class="table table-hover">',
				'<tr><th>标题</th><th>发布时间</th><th>操作</th></tr>'].join('');
		//每页显示条数
		var page_list_num = 8;
		getList(0,page_list_num,function(err,data){
			if(err){
				console.log('error');
				return
			}
			list_html += render(tpl,data.list);
			list_html += '</table></div>';
			
			list_html += '<div class="page"></div>';
			dom.html(list_html);
			//分页组件
			var page = admin.pageList(dom.find('.page'),{
				'list_count' : data.count,
				'page_cur' : 0,
				'page_list_num' : page_list_num
			});
			page.jump = function(num){
				
				//console.log(num,12);
				getList((num-1)*page_list_num,page_list_num,function(err,data){
					if(err){
						console.log('error');
						return
					}
					var new_html = render(tpl,data.list);
					
					dom.find('table').html(new_html);
				});
			};
		});
	}
	exports.friends = function(dom,id){
		listPage(dom);
	};
})(window.admin.render);

/**
 * 用户首页
 **/
(function(exports){
	var userIndex_tpl = ['<div class="navItem">',
	'</div>'].join('');
	
	function userIndex(dom){
		dom.html(userIndex_tpl);
	}
	
	exports.userIndex = userIndex;
})(window.admin.render);


/**
 * 用户列表
 **/
(function(exports){
	var userItem = ['<tr>',
		'<td>{username}</td>',
		'<td>{email}</td>',
		'<td>{user_group}</td>',
		'<td>',
			'<a href="user.html?userid={id}" target="_self">改</a>',
			'<a href="/ajax/del?from=user&id={id}" onclick="if(!confirm(\'三思啊，删了可就没啦！\')){return false;}" target="_self">删</a>',
		'</td>',
	'</tr>'].join('');
	
	function render(tpl,data){
		var txt = '';
		for(var i=0 in data){
			txt += tpl.replace(/{(\w*)}/g,function(){
				var key = arguments[1];
				return data[i][key] || '';
			});
		}
		return txt;
	}
	
	function userList(dom){
		$.ajax({
			'url' : '/ajax/user/list',
			'success' : function(d){
				var html = ['<div class="row">',
					'<a href="/admin/publish/opus" class="btn btn-primary btn-sm lofox" role="button">发作品</a>',
				'</div><br/>',
				'<div class="panel panel-default row">',
					'<table class="table table-hover">',
					'<tr><th>标题</th><th>邮箱</th><th>用户组</th><th>操作</th></tr>'].join('');
				html += render(userItem,d.list);
				html += '</table></div>';
				dom.html(html);
			},
			'error' : function(){
				dom.html('error');
			}
		})
	}
	
	exports.userList = userList;
})(window.admin.render);