/**
 * page background
 */
define(function () {
    'use strict';
	var config = {
		'delay' : 50000,
		'coverData' : [
			{'src': app_config.frontEnd_base + 'public/images/gallery/bamboo.jpg', 'alt': '竹子'},
			{'src': app_config.frontEnd_base + 'public/images/gallery/coast.jpg', 'alt': '江边'}
		]
	};
	
	function loadImg(src, param) {
		var parm = param || {},
			loadFn = parm.loadFn || null,
			sizeFn = parm.sizeFn || null,
			errorFn = parm.errorFn || null;
		
		var img = new Image(),
            timer;
		if (errorFn) {
			img.onerror = function () {
				errorFn();
			};
		}
		if (loadFn) {
			img.onload = function () {
				loadFn(img.width, img.height);
			};
		}
		if (sizeFn) {
			timer = setInterval(function () {
				if (img.width > 1) {
					clearInterval(timer);
					sizeFn(img.width, img.height);
				}
			}, 2);
		}
		img.src = src;
	}
	function CSS3(d, b) {
		var data = d,
			isWebkit = false,
			bj = b,
			total = data.length;
		bj.html('');
		
		if (supports('webkitAnimation')) {
			isWebkit = true;
		}
		
		function show(i) {
			var index = i,
				src = data[index].src;
			loadImg(src, {
                'loadFn' : function () {
                    var newPic = $('<div class="galBj_mask"></div>');
                    newPic.css({'backgroundImage' : 'url(' + src + ')'});
                    bj.html(newPic);

                    if (!isWebkit) {
                        newPic.hide().fadeIn(1000);
                    }

                    setTimeout(function () {
                        bj.css({'backgroundImage' : 'url(' + src + ')'});
                        newPic.hide();
                        index++;
                        index === total && (index = 0);
                        show(index);
                    }, config.delay);
                }
            });
		}
		show(0);
	}
	return function () {
		var $gallery = $('<div class="gallayer"><div class="galBj"></div><div class="galMask"></div></div>').hide(),
            $bj = $gallery.find('.galBj'),
			data = config.coverData;
        $('body').prepend($gallery);
        $gallery.fadeIn(200);
        CSS3(data, $bj);
	};
});