/**
 *
 *
 */
define(function () {
  'use strict';
  function init() {
    var scrollDelay,
        nodeBackTop = Sizzle('.back-top')[0],
        nodeBody = Sizzle('body')[0],
        nodeNav = Sizzle('.app_nav',nodeBody)[0];
    nodeNav.on('click','.nav a,.side a',function () {
      nodeBody.removeClass('nav_slidedown');
    }).on('click','.nav_mask', function () {
      nodeBody.removeClass('nav_slidedown');
    }).on('click','.nav_moreBtn',function () {
      utils.toggleClass(nodeBody,'nav_slidedown');
    });

    Sizzle('.backToOldVersion')[0].on('click', function () {
      UI.confirm({
        text : '确定要去当屌丝？',
        callback : function(){
          document.cookie = 'ui_version=html;path=/;';
          window.location.reload();
        }
      });
    });

    function checkBackTop(){
      var method = nodeBody.scrollTop > window.innerHeight*0.6 ? 'removeClass' : 'addClass';
      nodeBackTop[method]('hide');
    }
    checkBackTop();
    window.onscroll = function(){
      clearTimeout(scrollDelay);
      scrollDelay = setTimeout(checkBackTop,100);
    };
    nodeBackTop.on('click',function(){
      nodeBody.scrollTop = 0;
    });
  };

  function setCur(page) {
    if (page === '/') {
      page = 'index';
    }
    utils.each(Sizzle('.app_nav li'),function(node){
      node.removeClass('cur');
    });
    Sizzle('.app_nav li[page=' + page + ']')[0].addClass('cur');
  }
  var nav = init;
  nav.setCur = setCur;
  return nav;
});
