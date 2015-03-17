
/**
 * blogList page
 *  
 */


define(function(require,exports){
	var pagination = require('util/pagination.js');
  var empty_tpl = '<div class="blank-content"><p>啥都木有</p></div>';
	
	function getData(skip,limit,tag,callback){
		$.ajax({
			type : 'GET' ,
			url : '/ajax/blog',
			data : {
				act : 'get_list',
				skip : skip,
        tag : tag || null,
				limit : limit
			},
			success :function(data){
				var count = data['count'],
					 list = data['list'];
				for(var i in list){
					list[i].time_show = L.parseTime(list[i].time_show,'{y}-{mm}-{dd}');
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
			var tag_item_tpl = $('#tpl_blog_list_tag').html();
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
		var list_tpl = $('#tpl_blog_list_item').html();
		getData(this.skip,this.limit,this.tag,function(err,list,count){
			me.count = count;
			me.skip += me.limit;
      var html;
      if(list.length){
          html = juicer(list_tpl,{
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
		var baseTpl = $('#tpl_blog_list_base').html();
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
				list_count : list.count,
				page_cur : me.pageIndex,
				page_list_num : list.limit,
				max_page_btn : 6
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