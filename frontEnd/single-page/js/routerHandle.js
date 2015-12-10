define([
  'js/Base',
  'js/page/index',
  'js/page/blogList',
  'js/page/blogDetail',
  'js/page/labsList',
  'js/page/bless',
  'js/navigation'
],function(utils,indexPage,blogListPage,blogDetailPage,labsListPage,blessPage,navigation){
  'use strict';
  return function(lofox){
    var container = utils.query('.app_container'),
        nodeActivePage = null,
        activePage = null;
    //显示单页dom
    function getNewPage() {
      var nodeNew = utils.createDom('<div class="page"><div class="l-loading-panel"><span class="l-loading"></span><p>正在加载模块</p></div></div>');
      //移除老的page dom
      if (nodeActivePage) {
        var nodeOld = nodeActivePage;
            nodeActivePage = null;
            utils.addClass(nodeOld,'fadeOutRight');
        setTimeout(function () {
          utils.remove(nodeOld);
          utils.query('body').scrollTop = 0;
          utils.addClass(nodeNew,'fadeInLeft page-active');
          setTimeout(function () {
            utils.removeClass(nodeNew,'fadeInLeft');
          }, 500);
        }, 500);
      } else {
        utils.addClass(nodeNew,'page-active');
      }
      container.appendChild(nodeNew);
      return nodeActivePage = nodeNew;
    }

    //视图刷新前，销毁上一个对象
    lofox.on('beforeRefresh',function(){
      if(activePage && activePage.destroy){
        activePage.destroy();
      }
      activePage = null;
    })
    // 监听视图刷新事件
    .on('refresh', function (pathData,search) {
      //显示隐藏返回按钮
    });

    /**
     * 首页
     */
    lofox.set('/', function () {
      this.title('小剧客栈_剧中人的个人空间 网页设计师博客 互动设计学习者');
      navigation.setCur('/');
      var dom = getNewPage();

      activePage = new indexPage(dom);
    })
    // 博文列表
    .set('/blog', function (param, pathnde, search) {
      this.title('我的博客_小剧客栈');
      navigation.setCur('blog');
      var dom = getNewPage();

      activePage = new blogListPage(dom, search);
    });
    /**
     * 博客详细页
     */
    lofox.set('/blog/{id}', function (param) {
      this.title('我的博客_小剧客栈');
      navigation.setCur('blog');
      var dom = getNewPage();
      activePage = new blogDetailPage(dom, param.id, this.title.bind(this));
    })
    //实验室列表页
    .set('/labs', function () {
      this.title('实验室_小剧客栈');

      navigation.setCur('labs');
      var dom = getNewPage();
      activePage = new labsListPage(dom);
    })
    // 留言板
    .set('/bless', function () {
      this.title('留言板_小剧客栈');
      navigation.setCur('bless');
      var dom = getNewPage();

      activePage = new blessPage(dom);
    });
  };
});
