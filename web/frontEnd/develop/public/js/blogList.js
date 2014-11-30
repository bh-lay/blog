
/**
 * blogList page
 *  
 */


define(function(require,exports){
	var pagination = require('util/pagination.js');
	var baseTpl = ['<div class="articleListCnt">',
			'<div class="articleList"><div class="l-loading-panel"><span class="l-loading"></span><p>正在加载数据</p></div></div>',
			'<div class="pagination_cnt"></div>',
		'</div>'].join('');
	var blogTemp =  ['<ul>{@each list as it}<li>',
        '<div class="articleItem" articleId="${it.id}">',
		'<div class="artItCnt">',
            '{@if it.cover}',
			'<div class="artItPic">',
				'<a href="/blog/${it.id}" title="${it.title}" lofox="true" target="_self" >',
					'<img src="${it.cover}" alt="${it.title}" />',
				'</a>',
			'</div>',
			'{@/if}',
			'<div class="artItCpt">',
				'<a href="/blog/${it.id}" title="${it.title}" lofox="true" target="_self" >',
					'${it.title}',
				'</a>',
			'</div>',
			'<div class="artItInfo"><p>${it.intro}</p></div>',
			'<div class="artItTime">${it.time_show}</div>',
		'</div>',
	'</div>',
    '{@/each}</ul>'].join('');
	
	function getData(skip,limit,callback){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/blog',
			'data' : {
				'act' : 'get_list',
				'skip' : skip,
				'limit' : limit
			},
			'success' :function(data){
				var count = data['count'],
					 list = data['list'];
				for(var i in list){
					var date = new Date(parseInt(list[i].time_show));
					list[i].time_show = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();
					//使用七牛图床
					list[i].cover = L.qiniu(list[i].cover,{
						'type' : 'zoom',
						'width' : 420,
					});
				}
				
				callback && callback(null,list,count);
			}
		});
	}
	
	function LIST(dom){
		this.skip = 0;
		this.limit = 10;
		this.count = 0;
		this.dom = dom;
		this.onLoadStart = null;
		this.onLoaded = null;
	}
	LIST.prototype['renderPage'] = function(index,callback){
		var me = this;
		this.onLoadStart && this.onLoadStart();
		this.skip = (index-1 || 0) * this.limit;
		
		getData(this.skip,this.limit,function(err,list,count){
			me.count = count;
			me.skip += me.limit;
            
            var html = juicer(blogTemp,{
                'list' : list
            });
            me.dom.html(html);
			callback && callback();
			me.onLoaded && me.onLoaded.call(me);
		});
	};
	
	return function(dom,param){
        //插入基本模版
        dom.html(baseTpl);
        var $list = dom.find('.articleList');
        var $page_cnt = dom.find('.pagination_cnt');
        //获取当前页数
		var pageIndex = param.page || 1;
        //创建列表对象
        var list = new LIST($list);
        //渲染初始页
		list.renderPage(pageIndex,function(){
			//分页组件
			var page = new pagination($page_cnt,{
				'list_count' : list.count,
				'page_cur' : pageIndex,
				'page_list_num' : list.limit,
				'max_page_btn' : 7
			});
			page.jump = function(num){
				L.push('/blog?page=' + num);
				//list.renderPage(num);
				L.refresh();
			};
		});
	};
});