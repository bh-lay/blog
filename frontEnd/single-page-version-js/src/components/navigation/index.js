/**
 *
 *
 */

import './style.less';
import template from './index.html'
import utils from '../../js/Base.js';

function init () {
  let nodeBody = document.documentElement || utils.query('body');

  utils.query('.app-nav', nodeBody).outerHTML = template;

  let nodeNav = utils.query('.app-nav', nodeBody);
  utils.bind(nodeNav, 'click', '.nav a,.side a', function () {
    utils.removeClass(nodeBody, 'nav-slidedown');
  }).bind('click', '.nav-mask', function () {
    utils.removeClass(nodeBody, 'nav-slidedown');
  }).bind('click', '.nav-more-btn', function () {
    utils.toggleClass(nodeBody, 'nav-slidedown');
  });
}

function setCur (page) {
  if (page === '/') {
    page = 'index';
  }
  utils.removeClass(utils.query('.app-nav .cur'), 'cur');
  utils.addClass(utils.query('.app-nav a[data-page="' + page + '"]'), 'cur');
}

export default {init, setCur};
