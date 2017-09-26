/**
 * render
 *
 */

import './index.less';
import utils from '../../js/Base.js';
import juicer from '../../js/juicer.js';

const temp = require('./index.html');
let potoGraphaList = [
  {
    title: '随处撸码',
    author: '剧中人',
    imgSrc: require('./images/aboutme_2.jpg'),
    htmlSrc: 'https://bh-lay.tuchong.com/14977204/'
  },
  {
    title: '办公室背影',
    author: 'Oo浪沫',
    imgSrc: require('./images/aboutme.jpg'),
    htmlSrc: 'https://bh-lay.tuchong.com/'
  }
];
let potoGraphaIndex = -1;

// 图片预加载
function loadImg (src, callback) {
  if (!src) {
    callback && callback();
    return;
  }
  var img = new Image();

  function End () {
    callback && callback();
    callback = null;
  }

  img.onerror = img.onload = End;
  img.src = src;
}

function view (global) {
  const node = global.node;
  let nodeGallery;
  let photography = potoGraphaList[++potoGraphaIndex];
  node.innerHTML = juicer(temp, {
    photography
  });

  if (potoGraphaIndex + 1 >= potoGraphaList.length) {
    potoGraphaIndex = -1;
  }
  loadImg(photography.imgSrc, function () {
    nodeGallery = utils.query('.index-aboutme', node);
    utils.addClass(nodeGallery, 'zoom-show');
  }, 600);

  return {
    destroy: function () {
    }
  };
}

export default view;
