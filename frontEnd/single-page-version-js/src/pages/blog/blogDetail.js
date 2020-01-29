/**
 * blog detail
 *
 */

import './blogDetail.less';
import footer from '../../components/footer/index.js'
import Tie from '../../js/tie.js'
import utils from '../../js/Base.js';
import juicer from '../../js/juicer.js';
import hljs from '../../js/highlight.js';
import imageHosting from '../../js/imageHosting.js';
import blurRect from '../../js/blurRect.js';
import {Init as CommentInit} from '../../comments/index.js';

const template = require('./blogDetailPage.html');

function getData (id, fn) {
  utils.fetch({
    url: '/api/blog/' + id,
    data: {
      format: 'html'
    },
    callback: function (err, data) {
      if (!err && data && data.code === 200) {
        let detail = data['detail'];
        detail.time_show = utils.parseTime(detail.time_show, '{y}-{mm}-{dd}');

        fn && fn(null, detail);
      } else {
        fn && fn('博客不存在！');
      }
    }
  });
}

// 图片预加载
function loadImg (src, callback) {
  if (!src) {
    callback && callback();
    return;
  }
  let img = new Image();
  img.crossOrigin = 'Anonymous';

  function End () {
    callback && callback(img);
    callback = null;
  }

  img.onerror = img.onload = End;
  img.src = src;
}
function prefixID (htmlPart) {
  let idMatches = htmlPart.match(/^<h\d\s[^>]*data-id=(?:"|')([^"']+)/)
  let id = ''
  if (idMatches) {
    id = idMatches[1]
  } else {
    id = parseInt(Math.random() * 1000, 10) + '_' + parseInt(Math.random() * 100 * 100)
    htmlPart = htmlPart.replace(/(^<h\d)/, `$1 data-id="${id}" `)
  }
  return {
    htmlPart,
    id
  }
}
function getToc (article) {
  var toc = []
  article = article.replace(/<h(\d)(?:\s[^>]+)*>([^<]+)/g, (htmlPart, indent, text) => {
    let prefix = prefixID(htmlPart, indent, text)
    toc.push({
      indent,
      text,
      id: prefix.id
    })
    return prefix.htmlPart
  })
  let minItendent = Math.min.apply(Math, toc.map(item => item.indent))
  toc.forEach(item => {
    item.indent = item.indent - minItendent
  })
  return {
    article,
    toc
  }
}

class Page {
  constructor (global) {
    this.id = global.params.id
    this.element = global.node;
    this.tie = null
    this.detail = null
    getData(this.id, (err, detail) => {
      if (err && !detail) {
        global.push('/');
        global.refresh();
      } else {
        global.title(detail.title);
        this.init(detail)
        this.detail = detail
      }
    });
  }
  init (detail) {
    let result = getToc(detail.content)
    detail.content = result.article
    detail.toc = result.toc

    this.element.innerHTML = juicer(template, {
      article: detail
    });
    this.addCover(detail.cover)
    this.addCodeSupport()
    this.addComment()
    this.addToc()
    footer(utils.query('.section-footer', this.element))
    utils.bind(this.element, 'click', '.share-to-wechat', () => {
      this.createSharePop()
    })
    /**
     * 分享功能
     *  data-text data-url data-title data-img data-shareto
     */
    utils.bind(this.element, 'click', '.share-to-weibo', () => {
      let url = 'http://bh-lay.com/blog/' + this.detail.id;
      let text = this.detail.intro
      let img = this.detail.cover

      img = img ? imageHosting(img) : ''
      let shareUrl = 'http://service.weibo.com/share/share.php?title=' + text + '+&url=' + url + '&source=bookmark&appkey=2861592023&searchPic=false&pic=' + img
      window.open(shareUrl);
      return false;
    });
  }
  addCover (originCoverUrl) {
    let hasCover = originCoverUrl && originCoverUrl.length;
    let header = utils.query('header', this.element);
    if (!hasCover) {
      utils.addClass(header, 'no-cover');
      return
    }
    let coverUrl = imageHosting(originCoverUrl, {
      type: 'zoom',
      width: 420,
    });

    loadImg(coverUrl, function (img) {
      let width = header.clientWidth;
      let height = header.clientHeight;
      let canvas = document.createElement('canvas');
      let context = canvas.getContext('2d');
      // gaussBlur
      let newWidth = width;
      let newHeight = width * img.height / img.width;
      if (newHeight < height) {
        newHeight = height;
        newWidth = height * img.width / img.height;
      }
      let top = (height - newHeight) / 2;
      let left = (width - newWidth) / 2;
      canvas.width = width;
      canvas.height = height;
      context.drawImage(img, left, top, newWidth, newHeight)
      context.fillStyle = 'rgba(0,0,0,0.4)'
      context.fillRect(0, 0, width, height)
      blurRect(context, 0, 0, width, height, 8, 1);
      // header.appendChild(canvas);
      let bluredImg = canvas.toDataURL('image/png')
      header.style.backgroundImage = `url(${bluredImg})`
    });
  }
  addCodeSupport () {
    // 代码高亮
    utils.each(utils.queryAll('pre code', this.element), function (codeNode) {
      hljs(codeNode);
    });
  }
  addComment () {
    new CommentInit(utils.query('.comments_frame', this.element), 'blog-' + this.id, {
      list_num: 8
    });
  }
  addToc () {
    // 绑定 toc 点击事件
    utils.bind(utils.query('.toc-content', this.element), 'click', 'a', function (event) {
      let href = this.getAttribute('href').replace(/^#/, '')
      let node = utils.query('[data-id="' + href + '"]')
      if (!node) {
        return
      }
      let top = utils.offset(node).top - 80
      window.scrollTo(0, top)
    });
    let nodeTag = utils.query('.toc-content', this.element)
    this.tie = new Tie({
      dom: nodeTag,
      scrollDom: this.element,
      scopeDom: utils.parents(nodeTag, '.article-section'),
      fixed_top: 60
    });
  }
  createSharePop () {
    let wechatNode = utils.query('.wechat-area', this.element)
    if (wechatNode.children.length) {
      wechatNode.innerHTML = ''
      return
    }
    require.ensure(['asyncShareForMobile'], () => {
      // 引入 ace
      let {createShareCard} = require('asyncShareForMobile');
      let url = 'http://bh-lay.com/blog/' + this.detail.id;
      let coverUrl = this.detail.cover

      coverUrl = coverUrl ? imageHosting(coverUrl) : ''
      let canvas = createShareCard({
        title: this.detail.title,
        intro: this.detail.intro,
        url,
        coverUrl
      })
      wechatNode.appendChild(canvas)
    })
  }
  destroy () {
    this.tie && this.tie.destroy();
  }
};
export default Page
