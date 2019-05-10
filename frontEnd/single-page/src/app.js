/**
 * @author:bh-lay
 * Copyright (c) 2012-2018
 **/

// window.L = window.L || {};

import './less/app-base.less';

import navigation from './js/navigation.js'
import utils from './js/Base.js';
import imageHosting from './js/imageHosting.js';
import funny from './js/funny.js';
import UI from './js/dialog.js';
import routerHandle from './js/routerHandle.js';

/**
 * 判断是否支持css属性
 * 兼容css3
 */
let supports = (function () {
  let styles = document.createElement('div').style;
  let vendors = 'Webkit Khtml Ms O Moz'.split(/\s/);

  return function (prop) {
    if (prop in styles) {
      return prop;
    } else {
      prop = prop.replace(/^[a-z]/, function (val) {
        return val.toUpperCase();
      });
      let i = 0;
      let total = vendors.length;
      for (; i < total; i++) {
        if ((vendors[i] + prop) in styles) {
          return ('-' + vendors[i] + '-' + prop).toLowerCase();
        }
      }
    }
  };
})();
// 是否支持 canvas
let isSupportsCanvas = !!document.createElement('canvas').getContext;
// 是否为windows系统
let isWindows = /windows|win32/.test(navigator.userAgent.toLowerCase());
// 是否支持 history API
let isHistorySupported = window.history && window.history.pushState;
// 是否为高级浏览器
let isAdvancedBrowser = !!(supports('transform') && isHistorySupported && isSupportsCanvas);

// 屌丝就用屌丝版
if (!isAdvancedBrowser) {
  document.cookie = 'ui_version=html;path=/;';
  window.location.reload();
}
// 为windows系统定制body滚动条样式（仅webkit有效）
if (isWindows) {
  utils.addClass(utils.query('body'), 'define-scrollbar');
}
let L = {};
window.L = L;
// 占用全局方法
L.gravatar_error_fn = function (elem) {
  if (elem.src.indexOf('www.gravatar.com') > -1) {
    // 若gravatar官网请求失败，使用多说镜像
    elem.src = elem.src.replace('www.gravatar.com', 'gravatar.duoshuo.com');
  } else if (elem.src.indexOf('gravatar.duoshuo.com') > -1) {
    // 若多说镜像失败，使用默认头像
    elem.src = require('./images/default.jpg');
  }
  // 其余情况均不处理（已是默认头像）
};

// 配置弹出层
UI.config.zIndex(2000);

// 开始导航
navigation.init();
// 加入一些好玩的东西
funny();
// 开始掌控路由
routerHandle();
// 渐隐加载遮罩
utils.addClass(utils.query('.app_mask'), 'app_mask_out');
setTimeout(function () {
  utils.remove(utils.query('.app_mask'));
}, 1000);
