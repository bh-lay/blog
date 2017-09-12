/**
 * render
 *
 */

import './index.less';
import utils from '../../js/Base.js';

const temp = require('html-loader!./index.html');

function view (global) {
  const node = global.node;
  let nodeGallery;
  node.innerHTML = temp;

  nodeGallery = utils.query('.gallayer', node);

  setTimeout(function () {
    utils.addClass(nodeGallery, 'zoom-show');
  }, 600);

  return {
    destroy: function () {
    }
  };
}

export default view;
