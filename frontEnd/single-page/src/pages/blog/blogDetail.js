/**
 * blog detail
 *
 */

import './blogDetail.less';
import utils from '../../js/Base.js';
import juicer from '../../js/juicer.js';
import hljs from '../../js/highlight.js';
import imageHosting from '../../js/imageHosting.js';
import blurRect from '../../js/blurRect.js';
import {Init as CommentInit} from '../../comments/index.js';

const template = require('./blogDetailPage.html');

function getData (id, fn) {
  utils.fetch({
    url: '/ajax/blog',
    data: {
      act: 'get_detail',
      format: 'html',
      id: id
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

export default function (global, id) {
  let node = global.node;
  getData(id, function (err, detail, title) {
    if (err && !detail) {
      global.push('/');
      global.refresh();
      return;
    }

    global.title(detail.title);

    let hasCover = detail.cover && detail.cover.length;
    node.innerHTML = juicer(template, {
      article: detail,
      hasCover: hasCover
    });
    let header = utils.query('.header-cover', node);
    if (hasCover) {
      let coverUrl = imageHosting(detail.cover, {
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

        blurRect(context, 0, 0, width, height, 8, 1);
        header.appendChild(canvas);
      });
    } else {
      utils.addClass(header, 'no-cover');
    }
    // 代码高亮
    utils.each(utils.queryAll('pre code', node), function (codeNode) {
      hljs(codeNode);
    });

    new CommentInit(utils.query('.comments_frame', node), 'blog-' + id, {
      list_num: 8
    });
  });
};
