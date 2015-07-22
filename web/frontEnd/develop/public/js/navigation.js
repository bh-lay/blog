/**
 * 
 * 
 */
define(function () {
  'use strict';
  function init() {
    $('.app_nav').on('click','.nav a,.side a',function () {
      $('body').removeClass('nav_slidedown');
    }).on('click','.nav_mask', function () {
      $('body').removeClass('nav_slidedown');
    }).on('click','.nav_moreBtn',function () {
      $('body').toggleClass('nav_slidedown');
    });
    $('.backToOldVersion').on('click', function () {
      UI.confirm({
        text : '确定要去当屌丝？',
        callback : function(){
          document.cookie = 'ui_version=html;path=/;';
          window.location.reload();
        }
      });
    });
      
    function checkBackTop(){
      var $win = $(window),
          method = $win.scrollTop() > $win.height()*0.6 ? 'slideDown' : 'slideUp';
      $back_top[method](80);
    }
    var delay,
        $back_top = $('.back-top');
    checkBackTop();
    $(window).on('scroll',function(){
      clearTimeout(delay);
      delay = setTimeout(checkBackTop,100);
    });
    $back_top.click(function(){
      $('html,body').animate({
        scrollTop : 0
      },200);
    });
  };
  
  function setCur(page) {
    if (page === '/') {
      page = 'index';
    }
    $('.app_nav li').removeClass('cur');
    $('.app_nav li[page=' + page + ']').addClass('cur');
  }
  var nav = init;
  nav.setCur = setCur;
  return nav;
});