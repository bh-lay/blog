/**
 * render
 *
 */

import './index.less';
import utils from '../../js/Base.js';

const temp = require('./index.html');
let potoGraphaList = [require('./images/aboutme_2.jpg'), require('./images/aboutme.jpg')];
let potoGraphaIndex = -1;

//图片预加载
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
  node.innerHTML = temp;
  let imgSrc = potoGraphaList[++potoGraphaIndex];

  if (potoGraphaIndex + 1 >= potoGraphaList.length) {
    potoGraphaIndex = -1;
  }
  loadImg(imgSrc, function () {
    nodeGallery = utils.query('.index-aboutme', node);
    nodeGallery.style.backgroundImage = `url(${imgSrc})`;
    utils.addClass(nodeGallery, 'zoom-show');
  }, 600);

  return {
    destroy: function () {
    }
  };
}

export default view;
