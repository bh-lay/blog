/**
 * blogList page
 *
 */


define([
  'js/Base',
  '/js/stick',
  '/js/tie',
  'js/imageHosting',
  'js/juicer'
],function(utils,Stick,tie,imageHosting,juicer){
  var private_tag_data = null;
  function getTag(callback){
    if(private_tag_data){
      callback && callback(private_tag_data);
      return;
    }
    utils.fetch({
      url : '/ajax/tag/list',
      callback :function(err,data){
        data = data || {};
        data.list = data.list ? data.list.slice(0,10) : [];
        private_tag_data = data;
        callback && callback(private_tag_data);
      }
    });
  }
  function renderTags(dom,tagName,callback){
    getTag(function(data){
      var tag_item_tpl = __inline('/tpl/blogListTag.html'),
          html = juicer(tag_item_tpl,data),
          selector = tagName ? ('a[data-tag=' + tagName + ']') : 'a';

      dom.innerHTML = html;
      utils.addClass(utils.query(selector,dom),'active');
      utils.bind(dom,'click','a',function(){
        var tag = this.getAttribute('data-tag');
        callback && callback(tag);
      });
    });
  }


  function LIST(tag,onLoadStart,onLoaded){
    this.skip = 0;
    this.limit = 10;
    this.count = -1;
    this.tag = tag || null;
    this.onLoadStart = onLoadStart;
    this.onLoaded = onLoaded;
    this.isLoading = false;
    this.loadMore();
  }
  LIST.prototype.loadMore = function (){
    var me = this;
    if(this.isLoading || this.count>=0 && this.skip >= this.count){
      return;
    }
    this.isLoading = true;
    this.onLoadStart && this.onLoadStart();
    utils.fetch({
      url : '/ajax/blog',
      data : {
        act : 'get_list',
        skip : this.skip,
        tag : this.tag || null,
        limit : this.limit
      },
      callback :function(err,data){
        if(err || !data || data.code == 200){
          callback && callback('err');
          return;
        }
        var count = data['count'],
            list = data['list'],
            now = new Date().getTime();
        for(var i in list){
          //三月内的文章都算最新（多可悲）
          if((now - list[i].time_show)/(1000*60*60*24) < 90){
            list[i].is_new = true;
          }
          list[i].time_show = utils.parseTime(list[i].time_show,'{mm}-{dd} {y}');
          //使用七牛图床
          list[i].cover = imageHosting(list[i].cover,{
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
  };
  function page(global,param){
    var me = this,
        node = global.node,
        //获取标签名
        pageTag = param.tag ? decodeURI(param.tag) : null,
        baseTpl = __inline('/tpl/blogListBase.html'),
        list_tpl = __inline('/tpl/blogListItem.html'),
        empty_tpl = '<div class="blank-content"><p>啥都木有</p></div>';
    //插入基本模版
    node.innerHTML = baseTpl;
    this.nodeList = utils.query('.articleList',node);
    this.nodeLoading = utils.query('.l-loading-panel',node);

    this.stick = new Stick({
      container: me.nodeList,
      column_width: 280,
      column_gap: 10,
      load_spacing: 1000,
      onNeedMore: function(){
        list.loadMore();
      }
    });
    var nodeTag = utils.query('.articleListPage-tags',node);
    this.tie = util.tie({
      dom : nodeTag,
      scopeDom: utils.parents(nodeTag,'.articleListPage'),
      fixed_top: 50
    });
    //创建列表对象
    var list = new LIST(pageTag,function(){
      utils.removeClass(me.nodeLoading,'hide');
    },function(list){
      utils.addClass(me.nodeLoading,'hide');
      if(!list || list.length == 0){
        me.nodeList.innerHTML = empty_tpl;
      }else{
        list.forEach(function(item,index){
          var html = juicer(list_tpl,item);
          me.stick.addItem(html,item.cover);
        });
      }
    });
    //处理标签功能
    renderTags(utils.query('.articleListPage-tags .content',node),pageTag,function(tag){
      if(tag == 'null'){
        global.push('/blog');
      }else{
        global.push('/blog?tag=' + tag);
      }
      global.refresh();
    });

  }
  page.prototype = {
    destroy: function(){
      this.stick.destroy();
      this.tie.destroy();
    }
  };
  return page;
});
