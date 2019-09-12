import utils from './Base.js'
import navigation from '../components/navigation/index.js'
import Lofox from './lofox.js'
import IndexPage from '../pages/index/index.js'
import BlogListPage from '../pages/blog/blogList.js'
import BlogDetailPage from '../pages/blog/blogDetail.js'
import LabsListPage from '../pages/labs/labs-fe.js'
import PanoListPage from '../pages/labs/labs-pano.js'
import PhotographyListPage from '../pages/labs/labs-photography.js'
import BlessPage from '../pages/bless/bless.js'

// 绑定路由
let lofox = new Lofox();
let nodeContainer = utils.query('.app-container');

/**
 * 检测链接是否为提供给js使用的地址
 *   无地址、 javascript:: 、javascript:void(0)、#
 **/
function isHrefForScript (href) {
  return href.length === 0 || !!href.match(/^(javascript\s*:|#)/);
}

function Page (Controller, params, search) {
  this.params = params
  this.search = search
  this.node = this.createNode()
  this.view = new Controller(this)

  nodeContainer.appendChild(this.node)
  Page.activePage = this
}
Page.activePage = null
Page.prototype = {
  createNode: function () {
    let nodeNew = utils.createDom('<div class="page"><div class="l-loading-panel"><span class="l-loading"></span><p>正在加载模块</p></div></div>')
    if (Page.activePage) {
      let oldPage = Page.activePage
      Page.activePage = null

      // 调用销毁方法
      oldPage.view.destroy()
      let nodeOld = oldPage.node
      utils.addClass(nodeOld, 'zoomOutDown');

      setTimeout(function () {
        utils.addClass(nodeNew, 'slideInUp page-active');
        setTimeout(function () {
          utils.remove(nodeOld);
          utils.removeClass(nodeNew, 'slideInUp');
        }, 1100);
      }, 600);
    } else {
      utils.addClass(nodeNew, 'page-active');
    }
    return nodeNew
  },
  push: lofox.push.bind(lofox),
  replace: lofox.replace.bind(lofox),
  refresh: lofox.refresh.bind(lofox),
  title: lofox.title.bind(lofox)
};

export default function () {
  lofox.beforeTitleChange = function (title) {
    return title + '_剧中人的个人空间 网页设计师博客 互动设计学习者';
  };
  // 视图刷新前，销毁上一个对象
  lofox
    // 首页
    .set('/', function (param, search) {
      this.title('小剧客栈');
      navigation.setCur('/');

      new Page(IndexPage, param, search)
    })
    // 博文列表
    .set('/blog', function (param, search) {
      this.title('我的博客');
      navigation.setCur('blog');

      new Page(BlogListPage, param, search)
    })
    // 博客详细页
    .set('/blog/{id}', function (param, search) {
      this.title('我的博客');
      navigation.setCur('blog');
      new Page(BlogDetailPage, param, search)
    })
    // 实验室列表页
    .set('/labs', function (param, search) {
      this.title('实验室');

      navigation.setCur('labs');
      new Page(LabsListPage, param, search)
    })
    // 全景列表页
    .set('/720', function (param, search) {
      this.title('小剧的全景作品');

      navigation.setCur('720');
      new Page(PanoListPage, param, search)
    })
    // 摄影作品
    .set('/photography', function () {
      this.title('小剧的摄影作品');

      navigation.setCur('photography');
      new Page(PhotographyListPage)
    })
    // PanoListPage
    // 留言板
    .set('/bless', function () {
      this.title('留言板');
      navigation.setCur('bless');

      new Page(BlessPage)
    });

  // 全局控制 a 链接的打开方式
  utils.bind(utils.query('body'), 'click', 'a', function (e) {
    let url = this.getAttribute('href')
    let isUseReplace = this.hasAttribute('data-lofox-replace')
    // 为JS脚本准备的链接
    if (isHrefForScript(url)) {
      // 阻止浏览器默认事件，处理因base设置，导致此类链接在火狐中新窗口打开问题，感谢 @紫心蕊
      e.preventDefault();
    } else if (lofox.isInRouter(url)) {
      // 路由中配置的地址
      setTimeout(function () {
        if (isUseReplace) {
          lofox.replace(url);
        } else {
          lofox.push(url);
        }
        lofox.refresh();
      });
      e.preventDefault();
    }
    //  else{
    // html base 已设置链接为新窗口打开，此处无需处理
    //  }
  });
};
