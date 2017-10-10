/**
 *
 *
 */
import utils from './Base.js';
import UI from './dialog.js';

function init () {
  let scrollDelay;
  let nodeBackTop = utils.query('.back-top');
  let nodeBody = document.documentElement || utils.query('body');
  let nodeNav = utils.query('.app_nav', nodeBody);
  utils.bind(nodeNav, 'click', '.nav a,.side a', function () {
    utils.removeClass(nodeBody, 'nav_slidedown');
  }).bind('click', '.nav_mask', function () {
    utils.removeClass(nodeBody, 'nav_slidedown');
  }).bind('click', '.nav_moreBtn', function () {
    utils.toggleClass(nodeBody, 'nav_slidedown');
  });

  utils.bind(utils.query('.backToOldVersion'), 'click', function () {
    UI.confirm({
      text: '想看看屌丝版 ？',
      callback: function () {
        document.cookie = 'ui_version=html;path=/;';
        window.location.reload();
      }
    });
  });

  /**
   * 获取浏览器滚动尺寸
   *
   */
  function getScrollTop () {
    return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
  }

  function checkBackTop () {
    let method = getScrollTop() > window.innerHeight * 0.6 ? 'removeClass' : 'addClass';
    utils[method](nodeBackTop, 'hide');
  }

  checkBackTop();

  let distance = 50;
  // 是否已经置灰
  let isDarkened = false;
  let darkenClassName = 'darken';
  let useMethod;

  function fixNavClass () {
    let isNeedDarken = getScrollTop() > distance;
    let isNeedChange = isNeedDarken !== isDarkened;
    if (isNeedChange) {
      isDarkened = isNeedDarken;
      useMethod = (isNeedDarken ? 'add' : 'remove') + 'Class';

      utils[useMethod](nodeNav, darkenClassName);
    }
  }

  window.onscroll = function () {
    fixNavClass();
    clearTimeout(scrollDelay);
    scrollDelay = setTimeout(checkBackTop, 100);
  };
  utils.bind(nodeBackTop, 'click', function () {
    nodeBody.scrollTop = 0;
  });
};

function setCur (page) {
  if (page === '/') {
    page = 'index';
  }
  utils.removeClass(utils.query('.app_nav li.cur'), 'cur');
  utils.addClass(utils.query('.app_nav li[page=' + page + ']'), 'cur');
}

export default {init, setCur};
