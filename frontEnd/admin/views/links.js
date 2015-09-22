/**
 * 友情链接页面
 * @param {Object} dom
 * @param {String|Number} [id] article ID
 **/
define(function(require){
  var pageList = require('tools/pageList.js'),
      parseTime = require('tools/parseTime.js');
	var base_tpl = ['<div class="col-md-12 custom-mb10">',
			'<a class="btn btn-default custom-publish" href="javascript:void(0)" data-type="friends">加友链</a>',
		'</div>',
		'<div class="col-md-12">',
			'<div class="panel panel-default"></div>',
        '</div>',
        '<div class="page col-md-12"></div>'].join('');
    var item_tpl = ['<table class="table table-hover custom-listTable">',
        '<tr><th>标题</th><th>发布时间</th><th>操作</th></tr>',
        '{@each list as it}<tr {@if it.isShow == 0}class="disable"{@/if}>',
            '<td class="arLiTitle" title="${it.title}${it.url}">${it.title}</td>',
            '<td class="arLiTitle" title="添加时间">${it.time_create}</td>',
            '<td class="arLiEdit">',
			     '<a class="btn btn-default btn-xs custom-publish" title="修改"  href="javascript:void(0)" data-type="friends" data-id="${it.id}"><span class="glyphicon glyphicon-edit"></span></a>',
			     '<a class="btn btn-default btn-xs" title="删除" href="/ajax/del?from=blog_friend&id=${it.id}" data-item-selector="tr" data-action-del="三思啊，删了可就没啦！"><span class="glyphicon glyphicon-remove"></span></a>',
		  '</td>',
        '</tr>{@/each}',
    '</table>'].join('');
	//获取友情链接列表
	function getList(start,limit,callback){
		$.ajax({
			'url' : '/ajax/links/list',
			'type' : 'GET',
			'data' : {
				'skip' : start,
				'limit' : limit
			},
			'success' : function(data){
				for(var i in data.list){
					data.list[i].time_create = parseTime(data.list[i].time_create,'{y}-{m}-{d}');
				}
				callback(null,data);	
			}
		});
	}
	function listPage(dom){
		//每页显示条数
		var page_list_num = 8;
        dom.html(base_tpl);
		getList(0,page_list_num,function(err,data){
			if(err){
				return
			}
			var list_html = juicer(item_tpl,data);
			dom.find('.panel').html(list_html);
			//分页组件
			var page = new pageList(dom.find('.page'),{
				'list_count' : data.count,
				'page_cur' : 0,
				'page_list_num' : page_list_num
			});
			page.jump = function(num){
				
				getList((num-1)*page_list_num,page_list_num,function(err,data){
					if(err){
						return
					}
					var new_html = juicer(item_tpl,data);
					
					dom.find('.panel').html(new_html);
				});
			};
		});
	}
	return listPage;
});