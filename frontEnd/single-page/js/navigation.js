/**
 *
 *
 */
define([
  'exports',
  'js/Base'
],function (exports,utils) {
  'use strict';
  function init() {
    var scrollDelay,
        nodeBackTop = utils.query('.back-top'),
        nodeBody = utils.query('body'),
        nodeNav = utils.query('.app_nav',nodeBody);
    utils.bind(nodeNav,'click','.nav a,.side a',function () {
      utils.removeClass(nodeBody,'nav_slidedown');
    }).bind('click','.nav_mask', function () {
      utils.removeClass(nodeBody,'nav_slidedown');
    }).bind('click','.nav_moreBtn',function () {
      utils.toggleClass(nodeBody,'nav_slidedown');
    });

    utils.bind(utils.query('.backToOldVersion'),'click', function () {
      UI.confirm({
        text : '想看看屌丝版 ？',
        callback : function(){
          document.cookie = 'ui_version=html;path=/;';
          window.location.reload();
        }
      });
    });

    function checkBackTop(){
      var method = nodeBody.scrollTop > window.innerHeight*0.6 ? 'removeClass' : 'addClass';
      utils[method](nodeBackTop,'hide');
    }
    checkBackTop();
    window.onscroll = function(){
      clearTimeout(scrollDelay);
      scrollDelay = setTimeout(checkBackTop,100);
    };
    utils.bind(nodeBackTop,'click',function(){
      nodeBody.scrollTop = 0;
    });
  };

  function setCur(page) {
    if (page === '/') {
      page = 'index';
    }
    utils.removeClass(utils.query('.app_nav li.cur'),'cur');
    utils.addClass(utils.query('.app_nav li[page=' + page + ']'),'cur');
  }

  exports.init = init;
  exports.setCur = setCur;
});
