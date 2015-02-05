/**
 * 
 * 
 */
define(function () {
    'use strict';
	var init = function () {
		$('.nav_moreBtn').click(function () {
			$('body').toggleClass('nav_slidedown');
		});
		$('.app_nav .nav a').click(function () {
			$('body').removeClass('nav_slidedown');
		});
		
		$('.nav_mask').on('click', function () {
			$('body').removeClass('nav_slidedown');
		});
        $('.nav-back').click(function(){
            history.back();
        });
        console.log('init');
        $('.backToOldVersion').on('click', function () {
            UI.confirm({
                'text' : '确定要去当屌丝？'
            },function(){
                document.cookie = 'ui_version=html;path=/;';
                window.location.reload();
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
            $('.nav-back').fadeIn(200);
        },
        hide : function(){
            $('.nav-back').fadeOut(200);
        }
    };
	return nav;
});