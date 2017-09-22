/**
 * render
 *
 */

import './index.less';
import utils from '../../js/Base.js';

const temp = require('./index.html');
let potoGraphaList = [
  {
    title: '束河古城',
    imgSrc: require('./images/aboutme_2.jpg'),
    htmlSrc: 'https://bh-lay.tuchong.com/14591502/',
  },
  {
    title: '西沙湿地',
    imgSrc: require('./images/aboutme.jpg'),
    htmlSrc: 'https://bh-lay.tuchong.com/14465332/',
  }
];
let potoGraphaIndex = -1;
function view (global) {
  const node = global.node;
  let nodeGallery;
  node.innerHTML = temp;

  nodeGallery = utils.query('.index-aboutme', node);
  nodeGallery.style.backgroundImage = `url(${potoGraphaList[++potoGraphaIndex].imgSrc})`;

  if (potoGraphaIndex + 1 >= potoGraphaList.length) {
    potoGraphaIndex = -1;
  }
  setTimeout(function () {
    utils.addClass(nodeGallery, 'zoom-show');
  }, 600);

  return {
    destroy: function () {
    }
  };
}

export default view;
