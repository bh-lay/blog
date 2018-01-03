import utils from './Base.js'
import navigation from './navigation.js'
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
let nodeActivePage = null;
let activePage = null;

/**
 * 检测链接是否为提供给js使用的地址
 *   无地址、 javascript:: 、javascript:void(0)、#
 **/
function isHrefForScript (href) {
  return href.length === 0 || !!href.match(/^(javascript\s*:|#)/);
}

// 显示单页dom
function getNewPage () {
  let nodeNew = utils.createDom('<div class="page"><div class="l-loading-panel"><span class="l-loading"></span><p>正在加载模块</p></div></div>');
  // 移除老的page dom
  if (nodeActivePage) {
    let nodeOld = nodeActivePage;
    nodeActivePage = null;
    utils.addClass(nodeOld, 'fadeOutRight');

    setTimeout(function () {
      utils.remove(nodeOld);
      utils.query('body').scrollTop = 0;
      utils.addClass(nodeNew, 'fadeInLeft page-active');
      setTimeout(function () {
        utils.removeClass(nodeNew, 'fadeInLeft');
      }, 500);
    }, 500);
  } else {
    utils.addClass(nodeNew, 'page-active');
  }
  nodeContainer.appendChild(nodeNew);
  nodeActivePage = nodeNew;
  return nodeActivePage;
}

function Page () {
  this.node = getNewPage();
}

Page.prototype = {
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
    .on('beforeRefresh', function () {
      if (activePage && activePage.destroy) {
        activePage.destroy();
      }
      activePage = null;
    })
    // 首页
    .set('/', function () {
      this.title('小剧客栈');
      navigation.setCur('/');

      activePage = new IndexPage(new Page());
    })
    // 博文列表
    .set('/blog', function (param, pathNode, search) {
      this.title('我的博客');
      navigation.setCur('blog');

      activePage = new BlogListPage(new Page(), search);
    })
    // 博客详细页
    .set('/blog/{id}', function (param) {
      this.title('我的博客');
      navigation.setCur('blog');
      activePage = new BlogDetailPage(new Page(), param.id);
    })
    // 实验室列表页
    .set('/labs', function () {
      this.title('实验室');

      navigation.setCur('labs');
      activePage = new LabsListPage(new Page());
    })
    // 全景列表页
    .set('/720', function () {
      this.title('小剧的全景作品');

      navigation.setCur('720');
      activePage = new PanoListPage(new Page());
    })
    // 摄影作品
    .set('/photography', function () {
      this.title('小剧的摄影作品');

      navigation.setCur('photography');
      activePage = new PhotographyListPage(new Page());
    })
    // PanoListPage
    // 留言板
    .set('/bless', function () {
      this.title('留言板');
      navigation.setCur('bless');

      activePage = new BlessPage(new Page());
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
