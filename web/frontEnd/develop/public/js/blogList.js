
/**
 * blogList page
 *  
 */


define(function(require,exports){
	var pagination = require('util/pagination.js');
	
	var blogTemp =  ['<div class="articleItem" articleId="<%=id %>">',
		'<div class="artItCnt">',
			'<% if(cover){ %>',
			'<div class="artItPic">',
				'<a href="/blog/<%=id %>" title="<%=title %>" lofox="true" target="_self" >',
					'<img src="<%=cover %>" alt="<%=title %>" />',
				'</a>',
			'</div>',
			'<% } %>',
			'<div class="artItCpt">',
				'<a href="/blog/<%=id %>" title="<%=title %>" lofox="true" target="_self" >',
					'<%=title %>',
				'</a>',
			'</div>',
			'<div class="artItInfo"><p><%=intro %></p></div>',
			'<div class="artItTime"><%=time_show %></div>',
		//	'<div class="artItTag">${it.tags}</div>',
		'</div>',
	'</div>'].join('');
	
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
						'width' : 300,
						'height' : 100
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
	LIST.prototype.render = L.tplEngine(blogTemp);
	LIST.prototype['renderPage'] = function(index,callback){
		var me = this;
		this.onLoadStart && this.onLoadStart();
		this.skip = (index-1 || 0) * this.limit;
		
		this.dom.html('');
		
		getData(this.skip,this.limit,function(err,list,count){
			me.count = count;
			me.skip += me.limit;
			list.forEach(function(item,index){
				var html = me.render(item);
				var this_dom = $(html);
		
				me.dom.append(this_dom);
			});
			callback && callback();
			me.onLoaded && me.onLoaded.call(me);
		});
	};
	
	return function(dom,param){
		dom.html(['<div class="articleListCnt">',
			'<div class="articleList"></div>',
			'<div class="pagination_cnt"></div>',
		'</div>'].join(''));
		
		var $list = dom.find('.articleList');
		var $page_cnt = dom.find('.pagination_cnt');
		
		var list = new LIST($list);
		var pageIndex = param.page || 1;
		list.renderPage(pageIndex,function(){
			//分页组件
			var page = new pagination($page_cnt,{
				'list_count' : list.count,
				'page_cur' : pageIndex,
				'page_list_num' : list.limit,
				'max_page_btn' : 8
			});
			page.jump = function(num){
				L.push('/blog?page=' + num);
				//list.renderPage(num);
				L.refresh();
			};
		});
	};
});