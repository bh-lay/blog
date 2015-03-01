/**
 * 
 * 
 */
define(function () {
    'use strict';
	var init = function () {
		$('.app_nav').on('click','.nav a,.side a',function () {
			$('body').removeClass('nav_slidedown');
		}).on('click','.nav_mask', function () {
			$('body').removeClass('nav_slidedown');
		}).on('click','.nav-back', function(){
            history.back();
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
    nav.back = {
        show : function(){
            $('.nav-back').show();
        },
        hide : function(){
            $('.nav-back').hide();
        }
    };
	return nav;
});