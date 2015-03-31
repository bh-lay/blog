/**
 * blogList page
 *  
 */


define(function(require,exports){
  var Stick = require('public/js/stick');
  var private_tag_data = null;
	function getTag(callback){
      if(private_tag_data){
        callback && callback(private_tag_data);
        return;
      }
      $.ajax({
        type : 'GET' ,
        url : '/ajax/tag/list',
        success :function(data){
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
	
	
  function LIST(tag,onLoadStart,onLoaded){
    this.skip = 0;
    this.limit = 10;
    this.count = 0;
    this.tag = tag || null
    this.onLoadStart = onLoadStart;
    this.onLoaded = onLoaded;
    this.loadMore();
    this.isLoading = false;
  }
  LIST.prototype.loadMore = function (){
    var me = this;
    if(this.count!=0 && this.skip >= this.count){
      return
    }
    if(this.isLoading){
      return
    }
    this.isLoading = true;
    this.onLoadStart && this.onLoadStart();
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
        me.isLoading = false;
      }
    });
  }
  function page(dom,param){
    var me = this;
    var baseTpl = $('#tpl_blog_list_base').html();
    var empty_tpl = '<div class="blank-content"><p>啥都木有</p></div>';
    //插入基本模版
    dom.html(baseTpl);
    this.$list = dom.find('.articleList');
    this.$loading = dom.find('.l-loading-panel');
    var list_tpl = $.trim($('#tpl_blog_list_item').html());
    //获取标签名
    var pageTag = param.tag ? decodeURI(param.tag) : null;
    this.stick = new Stick({
      container: me.$list[0],
      column_width: 300,
      column_gap: 10,
      onNeedMore: function(){
        list.loadMore();
      }
    });
    //创建列表对象
    var list = new LIST(pageTag,function(){
      me.$loading.fadeIn();
    },function(list){
      me.$loading.fadeOut();
      if(!list || list.length == 0){
        me.$list.html(empty_tpl);
      }
      list.forEach(function(item){
        var html = juicer(list_tpl,{
            list : [item]
        });
        me.stick.addItem($(html)[0],item.cover);
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