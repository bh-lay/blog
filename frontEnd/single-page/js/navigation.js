/**
 *
 *
 */
define(function () {
  'use strict';
  function init() {
    // $('.app_nav').on('click','.nav a,.side a',function () {
    //   $('body').removeClass('nav_slidedown');
    // }).on('click','.nav_mask', function () {
    //   $('body').removeClass('nav_slidedown');
    // }).on('click','.nav_moreBtn',function () {
    //   $('body').toggleClass('nav_slidedown');
    // });

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
      var method = Sizzle('body')[0].scrollTop > window.innerHeight*0.6 ? 'slideDown' : 'slideUp';
      $back_top.removeClass('slideDown' , 'slideUp');
      $back_top.addClass(method);
    }
    var delay,
        $back_top = Sizzle('.back-top')[0];
    checkBackTop();
    window.onscroll = function(){
      clearTimeout(delay);
      delay = setTimeout(checkBackTop,100);
    };
    $back_top.on('click',function(){
      $('html,body').animate({
        scrollTop : 0
      },200);
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
