
/**
 * blogList page
 *  
 */


define(function(require,exports){
	var pagination = require('util/pagination.js');
	
	var blogTemp =  ['<div class="articleItem" articleId="<%=id %>">',
		'<div class="artItCnt">',
		/**	'<% if(cover){ %>',
			'<div class="artItPic">',
				'<a href="/blog/<%=id %>" title="<%=title %>" lofox="true" target="_self" >',
					'<img src="<%=cover %>" alt="<%=title %>" />',
				'</a>',
			'</div>',
			'<% } %>',
		**/	'<div class="artItCpt">',
				'<a href="/blog/<%=id %>" title="<%=title %>" lofox="true" target="_self" >',
					'<%=title %>',
				'</a>',
			'</div>',
		//	'<div class="artItInfo"><p><%=intro %></p></div>',
		//	'<div class="artItTime"><%=time_show %></div>',
		//	'<div class="artItTag">${it.tags}</div>',
		'</div>',
	'</div>'].join('');
	
	function LIST(dom){
		this.skip = 0;
		this.limit = 10;
		this.count = 0;
		this.dom = dom;
		this.onLoadStart = null;
		this.onLoaded = null;
	}
	LIST.prototype.render = L.tplEngine(blogTemp);
	LIST.prototype['renderPage'] = function(index){
		var me = this;
		this.onLoadStart && this.onLoadStart();
		this.skip = (index || 0) * this.limit;
		
		this.dom.html('');
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/blog',
			'data' : {
				'act' : 'get_list',
				'skip' : this.skip,
				'limit' : this.limit
			},
			'success' :function(data){
				var count = data['count'],
					 list = data['list'];
				for(var i in list){
					var date = new Date(parseInt(list[i].time_show));
					list[i].time_show = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();
					//使用七牛图床
					list[i].cover = L.qiniu(list[i].cover,{
						'width' : 300,
						'height' : 100
					});
				}
				
				me.count = count;
				me.skip += me.limit;
				
				for(var i=0,total=list.length;i<total;i++){
					me.addItem(list[i]);
				}
				
				me.onLoaded && me.onLoaded.call(me);
			}
		});
	};
	LIST.prototype['addItem'] = function(item){
		var html = this.render(item);
		var this_dom = $(html).hide();
		
		this.dom.append(this_dom);
		this_dom.fadeIn(200);
	};
	
	return function(dom,param){
		dom.html(['<div class="articleListCnt">',
			'<div class="articleList"></div>',
			'<div class="blog_addMore">',
				'<a href="javascript:void(0)">加载更多</a>',
				'<span>正在加载……</span>',
			'</div>',
			'<div class="pagination_cnt"></div>',
		'</div>'].join(''));
		
		var $list = dom.find('.articleList');
		var $page_cnt = dom.find('.pagination_cnt');
		
		var list = new LIST($list);
		list.renderPage(1);
		//分页组件
		var page = new pagination($page_cnt,{
			'list_count' : 1000,
			'page_cur' : 0,
			'page_list_num' : 10,
			'max_page_btn' : 8
		});
		console.log(pagination,page,1111)
		page.jump = function(num){
			//console.log(num,12);
			//list.more();
		};
	};
});