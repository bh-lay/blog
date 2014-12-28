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
		
		var active_plane;
        var delay;
        $('.nav a').on('mouseenter', function () {
            if (!isSupportTouch && $(window).width() > 660) {
                active_plane && active_plane.close();
                var offset = $(this).offset(),
                    title  = $(this).attr('data-title');
                clearTimeout(delay);
                delay = setTimeout(function () {
                    active_plane = UI.plane({
                        'top' : offset.top + 5,
                        'left' : 55,
                        'html' : '<div class="nav_tips">' + title + '</div>',
                        'from' : 'right',
                        'closeFn' : function () {
                            active_plane = null;
                        }
                    });
                }, 100);
            }
        }).on('mouseleave', function () {
            clearTimeout(delay);
            active_plane && active_plane.close();
        });
		
		
		$('.nav_mask').on('click', function () {
			$('body').removeClass('nav_slidedown');
		});
        $('.nav-back').click(function(){
            history.back();
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