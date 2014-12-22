/**
 * 
 * 
 */
define(function () {
    'use strict';
	var init = function () {
        if(L.supports.touch){
            $('.nav_moreBtn').click(function () {
                console.log(1234)
                $('body').toggleClass('nav_slidedown');
            });
        }else{
            var delay;
            $('.nav_moreBtn').mouseenter(function () {
                clearTimeout(delay);
                $('body').addClass('nav_slidedown');
            }).mouseleave(function(){
                clearTimeout(delay);
                delay = setTimeout(function(){
                    $('body').removeClass('nav_slidedown');
                },600);
            });
            
            $('.nav_body').mouseenter(function () {
                clearTimeout(delay);
            }).mouseleave(function(){
                clearTimeout(delay);
                delay = setTimeout(function(){
                    $('body').removeClass('nav_slidedown');
                },600);
            });
        }
		$('.app_nav .nav a').click(function () {
			$('body').removeClass('nav_slidedown');
		});
		
		$('.nav_mask').on('click', function () {
			$('body').removeClass('nav_slidedown');
		});
		var active_pop;
		$('.nav_setting').click(function () {
			if (active_pop) {
				return;
			}
			var offset = $(this).offset();
			active_pop = UI.pop({
				'title' : '设置',
				'from': $(this)[0],
				'width': 400,
				'html': '<div class="setting_pop"><a class="backToOldVersion" href="javascript:void(0)">我要用屌丝版</a></div>',
				'closeFn': function () {
					active_pop = null;
				}
			});
			
			$(active_pop.dom).on('click', '.backToOldVersion', function () {
				document.cookie = 'ui_version=html;path=/;';
				window.location.reload();
			});
		});
	};

	function setCur(page) {
		if (page === '/') {
			page = 'index';
		}
		$('.app_nav .nav li').removeClass('cur');
		$('.app_nav .nav li[page=' + page + ']').addClass('cur');
	}
	var nav = init;
	nav.setCur = setCur;
	return nav;
});