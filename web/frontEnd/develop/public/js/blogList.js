
/**
 * blogList page
 *  
 */


define(function(require,exports){
	var pagination = require('util/pagination.js');
	var baseTpl = ['<div class="articleListPage">',
        '<div class="grid-row"><div class="grid-col-fix-220">',
            '<div class="side_card articleListPage-tags">',
                '<div class="caption"><strong>标签</strong></div>',
                '<div class="content"></div>',
            '</div>',
        '</div><div class="grid-col-flow-220"',
        '<div class="articleListPage-main">',
			'<div class="articleList"><div class="l-loading-panel"><span class="l-loading"></span><p>正在加载数据</p></div></div>',
			'<div class="pagination_cnt"></div>',
		'</div>',
        '</div></div>',
    '</div>'].join('');
	var tag_item_tpl = '<a data-tag="null" href="javascript:void(0)">全部</a>{@each list as it}<a href="javascript:void(0)" data-tag="${it.name}">${it.name}<span>${it.count}</span></a>{@/each}';
	var blogTemp =  ['{@each list as it}',
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
    '{@/each}'].join('');
    var empty_tpl = ['<div class="blank-content"><p>啥都木有</p></div>'].join('');
	
	function getData(skip,limit,tag,callback){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/blog',
			'data' : {
				'act' : 'get_list',
				'skip' : skip,
                'tag' : tag || null,
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
	var private_tag_data = null;
	function getTag(callback){
		if(private_tag_data){
			callback && callback(private_tag_data);
			return;
		}
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/tag/list',
			'success' :function(data){
				data = data || {};
				data.list = data.list ? data.list.slice(0,12) : [];
				private_tag_data = data;
				callback && callback(private_tag_data);
			}
		});
	}
	function renderTags(dom,tagName,callback){
		getTag(function(data){
			var html = juicer(tag_item_tpl,data);
			dom.html(html);
			
			if(tagName){
				dom.find('a').each(function(){
					if($(this).attr('data-tag') == tagName){
						$(this).addClass('active');
					}
				});
			}else{
				dom.find('a').eq(0).addClass('active');
			}
			dom.on('click','a',function(){
				var $btn = $(this);
				var tag = $btn.attr('data-tag');
				callback && callback(tag);
			});
		});
	}
	function LIST(dom,tag){
		this.skip = 0;
		this.limit = 10;
		this.count = 0;
        this.tag = tag || null
		this.dom = dom;
		this.onLoadStart = null;
		this.onLoaded = null;
	}
	LIST.prototype['renderPage'] = function(index,callback){
		var me = this;
		this.onLoadStart && this.onLoadStart();
		this.skip = (index-1 || 0) * this.limit;
		
		getData(this.skip,this.limit,this.tag,function(err,list,count){
			me.count = count;
			me.skip += me.limit;
            var html;
            if(list.length){
                html = juicer(blogTemp,{
                    'list' : list
                });
            }else{
                html = empty_tpl;
            }
            me.dom.html(html);
			callback && callback();
			me.onLoaded && me.onLoaded.call(me);
		});
	};
	
	function page(dom,param){
		var me = this;
        //插入基本模版
        dom.html(baseTpl);
        this.$list = dom.find('.articleList');
        this.$page_cnt = dom.find('.pagination_cnt');
        //获取当前页数
		this.pageIndex = param.page || 1;
        //获取标签名
        var pageTag = param.tag ? decodeURI(param.tag) : null;
        //创建列表对象
        var list = new LIST(this.$list,pageTag);
		
		var scrollDelay;
		this.scrollListener = function(){
			clearTimeout(scrollDelay);
			scrollDelay = setTimeout(function(){
				if(document.body.scrollTop + window.innerHeight + 200 >= document.body.scrollHeight){
				//	console.log('scrolling bottom');
				}
			},100);
		}
        //渲染初始页
		list.renderPage(this.pageIndex,function(){
			//分页组件
			var page = new pagination(me.$page_cnt,{
				'list_count' : list.count,
				'page_cur' : me.pageIndex,
				'page_list_num' : list.limit,
				'max_page_btn' : 6
			});
			page.jump = function(num){
				var newUrl = '/blog?page=' + num;
                if(pageTag){
                    newUrl += '&tag=' + pageTag;
                }
                L.push(newUrl);
				//list.renderPage(num);
				L.refresh();
			};
		});
        //处理标签功能
		renderTags(dom.find('.side_card .content'),pageTag,function(tag){
			if(tag == 'null'){
				L.push('/blog');
			}else{
				L.push('/blog?tag=' + tag);
			}
			L.refresh();
		});
		$(document).scroll(this.scrollListener);
	}
	page.prototype = {
		destroy: function(){
			$(document).unbind('scroll',this.scrollListener);
		}
	};
	return page;
});