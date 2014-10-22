
/**
 * 博文列表页
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
define(function(){
	var tpl = ['<div class="panel panel-default"><div class="panel-body">{@each list as it}',
		'<div class="media" data-uid="${it.uid}" data-cid="${it.cid}">',
			'<div class="pull-left">',
				'<img width="50" height="50" src="{@if it.user.avatar}${it.user.avatar}{@else}http://layasset.qiniudn.com/user/default.jpg{@/if}"/>',
			'</div>',
			'<div class="media-body">',
				'<h4 class="media-heading">{@if it.user.blog}<a href="${it.user.blog}">${it.user.username}</a>{@else}${it.user.username}{@/if} </h4>',
				'<p">${it.content}</p>',
				'<div class="l_com_item_time">${it.time}</div>',
			'</div>',
		'</div>',
	'{@/each}</div></div>'].join('');

	//获取文章列表
	function getList(start,limit,callback){
		$.ajax({
			'url' : '/ajax/comments/list',
			'type' : 'GET',
			'data' : {
				'act' : 'get_list',
				'skip' : start,
				'limit' : limit
			},
			'success' : function(d){
				var data = d.data;
				for(var i in data.list){
					data.list[i].time = parse.time(data.list[i].time,'{y}年 {m}月 {d}日 {h}:{i}');
				}
				callback(null,data);	
			}
		});
	}
	function listPage(dom){
		//每页显示条数
		var page_list_num = 8;
		dom.html('<div class="list_cnt"></div><div class="page_cnt"></div>');
		var $list_cnt = dom.find('.list_cnt');
		var $page_cnt = dom.find('.page_cnt');
		getList(0,page_list_num,function(err,data){
			if(err){
				console.log('error');
				return
			}
			var list_html = juicer(tpl,data);
			
			$list_cnt.html(list_html);
			//分页组件
			var page = admin.pageList($page_cnt,{
				'list_count' : data.count,
				'page_cur' : 0,
				'page_list_num' : page_list_num,
				'max_page_btn' : 8
			});
			page.jump = function(num){
				//console.log(num,12);
				getList((num-1)*page_list_num,page_list_num,function(err,data){
					if(err){
						console.log('error');
						return
					}
					var list_html = juicer(tpl,data);
					$list_cnt.html(list_html);
				});
			};
		});
	}
	
	return function(dom,id){
		listPage(dom);
	};
});