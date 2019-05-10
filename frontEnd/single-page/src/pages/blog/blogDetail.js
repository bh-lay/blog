/**
 * blog detail
 *
 */

import './blogDetail.less';
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
  console.log('idMatches', idMatches)
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
  constructor (global, id) {
    this.id = id
    this.element = global.node;
    this.tie = null
    getData(id, (err, detail) => {
      if (err && !detail) {
        global.push('/');
        global.refresh();
      } else {
        global.title(detail.title);
        this.init(detail)
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
    setTimeout(() => {
      this.createSharePop()
    }, 2000)
    this.addCover(detail.cover)
    this.addCodeSupport()
    this.addComment()
    this.addToc()
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
      scopeDom: utils.parents(nodeTag, '.article-section'),
      fixed_top: 60
    });
  }
  createSharePop () {
    require.ensure(['asyncShareForMobile'], () => {
      // 引入 ace
      let {createShareCard} = require('asyncShareForMobile');
      createShareCard({
        title: '----234567890-= ',
        intro: '----234567890-= ----234567890-= ----234567890-= ',
        url: 'http://baidu.com',
        coverUrl: 'http://static.bh-lay.com//blog/webpack-async-module/module-1.png'
      })
    })
  }
  destroy () {
    this.tie && this.tie.destroy();
  }
};
export default Page
