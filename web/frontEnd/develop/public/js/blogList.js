/**
 * blogList page
 *  
 */

function loadImg(src,callback){
  var img = new Image();
  function End(){
    clearInterval(timer);
    callback && callback();
    callback = null;
  }
  img.onerror = End;
  img.onload = End;
  var timer = setInterval(function(){
    if(img.width>1){
      End();
    }
  },2);
  img.src=src;
}

function Stick(param){
  var param = param || {},
      me = this;
  this.$container = param.$container;
  this.onNeedMore = param.onNeedMore || null;
  this.column_gap = param.column_gap || 20;
  this.column_width_base = param.column_width || 300;
  this.column_width;
  this.column_num;
  
  this.list = [];
  this.last_row = [];

  var scrollDelay;
  this.scrollListener = function(){
    clearTimeout(scrollDelay);
    scrollDelay = setTimeout(function(){
      if(document.body.scrollTop + window.innerHeight + 200 >= document.body.scrollHeight){
        console.log('scroll end');
      	me.onNeedMore && me.onNeedMore();
      }
    },100);
  };
  this.resizeListener = function(){
    setTimeout(function(){
      me.buildLayout();
      me.$container.find('.stickItem').each(function(){
        me.fixPosition($(this));
      });
    },500);
  };
  $(document).scroll(this.scrollListener);
  $(window).resize(this.resizeListener);
  this.$container.html('');
  this.buildLayout();
}
Stick.prototype = {
  buildLayout : function(){
    var width = this.$container.width();
    this.list = [];
    this.last_row = [];
    this.column_num = parseInt((width+this.column_gap)/(this.column_width_base+this.column_gap));
    this.column_width = (width + this.column_gap)/this.column_num - this.column_gap;
  },
  fixPosition: function($item){
    if(this.column_num > 1){
      var column_index,
          top;
      if(this.list.length < this.column_num){
        column_index = this.list.length;
        this.last_row.push($item.height());
      }else{
        top = Math.min.apply(null,this.last_row);
        column_index = this.last_row.indexOf(top);
        top = top + this.column_gap;
      }
      this.list.push($item);
      $item.css({
        position : 'absolute',
        top: top || 0,
        left: column_index * (this.column_width + this.column_gap),
        width: this.column_width
      }).addClass('stickItem fadeInLeft');
      setTimeout(function(){
        $item.removeClass('fadeInLeft');
      },1000);
      this.last_row[column_index] = parseInt($item.css('top')) + $item.height();
      this.$container.height(Math.max.apply(null,this.last_row));
    }else{
       $item.css({
        position : 'static',
        width: 'auto'
      });
    }
  },
  addItem: function($item){
    this.$container.append($item);
    this.fixPosition($item);
  },
  destroy: function(){
		$(document).unbind('scroll',this.scrollListener);
		$(window).unbind('resize',this.resizeListener);
	}
};

define(function(require,exports){
  var empty_tpl = '<div class="blank-content"><p>啥都木有</p></div>';
	
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
	
	
  function LIST(tag,onLoaded){
    this.skip = 0;
    this.limit = 10;
    this.count = 0;
    this.tag = tag || null
    this.onLoaded = onLoaded;
    this.loadMore();
  }
  LIST.prototype.loadMore = function (){
    var me = this;
		$.ajax({
			type : 'GET' ,
			url : '/ajax/blog',
			data : {
				act : 'get_list',
				skip : this.skip,
        tag : this.tag || null,
				limit : this.limit
			},
			success :function(data){
				var count = data['count'],
					 list = data['list'];
        if(data.code == 500){
          callback && callback(500);
          return
        }
				for(var i in list){
					list[i].time_show = L.parseTime(list[i].time_show,'{y}-{mm}-{dd}');
					//使用七牛图床
					list[i].cover = L.qiniu(list[i].cover,{
						type : 'zoom',
						width : 420,
					});
				}
        me.count = count;
        me.skip += me.limit;
        me.onLoaded && me.onLoaded.call(me,list,count);
			}
		});
	}
	function page(dom,param){
		var me = this;
		var baseTpl = $('#tpl_blog_list_base').html();
    //插入基本模版
    dom.html(baseTpl);
    this.$list = dom.find('.articleList');
    var list_tpl = $.trim($('#tpl_blog_list_item').html());
    //获取标签名
    var pageTag = param.tag ? decodeURI(param.tag) : null;
    this.stick = new Stick({
      $container: me.$list,
      column_width: 300,
      column_gap: 10,
      onNeedMore: function(){
        list.loadMore();
      }
    });
    //创建列表对象
    var list = new LIST(pageTag, function(list){
      list.forEach(function(item){
        loadImg(item.cover,function(){
          var html = juicer(list_tpl,{
              list : [item]
          });
          me.stick.addItem($(html));
        });
      });
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
	}
	page.prototype = {
		destroy: function(){
      this.stick.destroy();
		}
	};
	return page;
});