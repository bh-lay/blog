/**
 * @author:bh-lay
 * Blog : http://bh-lay.com/
 * Copyright (c) 2012-2018
**/
/**
 * 判断是否支持css属性
 * 兼容css3
 */
var supports = (function() {
    var styles = document.createElement('div').style,
        vendors = 'Webkit Khtml Ms O Moz'.split(/\s/);

    return function(prop) {
        if ( prop in styles ){
            return prop;
        }else{
            prop = prop.replace(/^[a-z]/, function(val) {
                return val.toUpperCase();
            });
            for(var i=0,total=vendors.length;i<total;i++){
                if ( vendors[i] + prop in styles ) {
                    return ('-' + vendors[i] + '-' + prop).toLowerCase();
                }
            }
        }
    };
})();
/**
 * 是否支持 canvas
 * 是否支持touch
 */
var supports_canvas = !!document.createElement('canvas').getContext ? true : false;
var isSupportTouch = document.hasOwnProperty("ontouchend") ? true : false;
/**
 * 是否为高级浏览器
 * 是否为手机浏览器
 *
 */
var isAdvancedBrowser = (supports('transition') && supports('transform') && supports_canvas) ? true : false;
var isMobileBrowser = (window.innerWidth < 720 && isSupportTouch) ? true : false;



//屌丝就用屌丝版
if (!isAdvancedBrowser) {
	document.cookie = 'ui_version=html;path=/;';
	window.location.reload();
}

define(function (require, exports) {
    require('public/js/jquery');
	require('public/js/juicer.js');
	require('util/lofox_1_0.js');
	require('UI/dialog.js');
	var nicescroll_factory = require('public/js/nicescroll.js');
    nicescroll_factory(jQuery);
    //绑定路由
    var lofox = new util.lofox();
    routerHandle(lofox);
    
    L.user = require('public/js/user.js');
    L.gallery = require('public/js/page_background.js');
    L.nav = require('public/js/navigation.js');
    L.views = {
        'index' : require('public/js/index.js'),
        'blogList' : require('public/js/blogList.js'),
        'blogDetail' : require('public/js/blogDetail.js'),
        'opusList' : require('public/js/opusList.js'),
        'opusDetail' : require('public/js/opusDetail.js'),
        'labsList' : require('public/js/labsList.js'),
        'comments' : require('comments/index.js')
    };
	L.push = function (url) {
		lofox.push(url);
	};
	L.refresh = function () {
		lofox.refresh();
	};
    L.supports = {
        'touch' : isSupportTouch
    };
    //配置弹出层
    UI.config.zIndex(2000);
    //显示背景图
    if (supports('backgroundSize') && !isMobileBrowser) {
        L.gallery();
    }
    //nicescrol
    $('body').niceScroll({
        zindex : 2001,
        cursorborder: '1px solid rgba(255,255,255,.2)',
        mousescrollstep: 60,
        railpadding: {
            right : 1
        },
        bouncescroll: true
    });
    
    //开始导航
    L.nav();
    setTimeout(function () {
        $('.app_mask').fadeOut(500, function () {
            $(this).remove();
        });
    }, 500);
	
});
window.L = window.L || {};

/**
 *使用七牛云存储
 * 若url为绝对地址，则使用源图，且不处理剪裁缩放
 * L.qiniu(url,config);
 */
(function (exports) {
    'use strict';
	function cover(url, config) {
		var w = config.width || config.height,
		    h = config.height || config.width;
		return url + '?imageView/1/w/' + w + '/h/' + h + '/q/85';
	}
	function zoom(url, config) {
		var confStr;
		if (config.width) {
			confStr = 'w/' + config.width;
		} else {
			confStr = 'h/' + config.height;
		}
		
		return url + '?imageView2/2/' + confStr + '/q/85';
	}
	var baseDomain = app_config.imgDomain;
	exports.qiniu = function (url, config) {
		var src = url;
		if (typeof (url) === 'string' && url.length > 0 && url[0] === '/') {
			src = baseDomain + url;
			if (config) {
				if (config.type === "zoom") {
					src = zoom(src, config);
				} else {
					//config.type == "cover"
					src = cover(src, config);
				}
			}
		}
		return src;
	};
}(L));

function routerHandle(lofox) {
    'use strict';
	var dom = $('.contlayer'),
        container = $('.app_container'),
        $active_page = null,
        o_active_page = null;
	//移除老的page dom
	function removePageDom(callback) {
		if ($active_page) {
            var $old = $active_page;
			$active_page = null;
			$old.addClass('fadeOutRight');
			setTimeout(function () {
				$old.remove();
                $('html,body').scrollTop(0);
                callback && callback();
			}, 500);
		} else {
            callback && callback();
        }
	}
	//显示单页dom
	function getNewPage() {
		var newDom = $('<div class="page"><div class="l-loading-panel"><span class="l-loading"></span><p>正在加载模块</p></div></div>');
        //移除老的dom
        removePageDom(function () {
            container.append(newDom);
            newDom.addClass('fadeInLeft');
            setTimeout(function () {
                newDom.removeClass('fadeInLeft');
            }, 500);
        });
		$active_page = newDom;
		return newDom;
	}
	
	/**
	 * 首页
	 */
	lofox.set('/', function () {
		this.title('小剧客栈_剧中人的个人空间 网页设计师博客 互动设计学习者');
		L.nav.setCur('/');
		var dom = getNewPage();
		
		o_active_page = new L.views.index(dom);
	});
	/**
	 * 博文列表
	 */
	lofox.set('/blog', function (param, pathnde, search) {
		this.title('我的博客_小剧客栈');
		L.nav.setCur('blog');
		var dom = getNewPage();
		
		o_active_page = L.views.blogList(dom, search);
	});
	/**
	 * 博客详细页
	 */
	lofox.set('/blog/{id}', function (param) {
		this.title('我的博客_小剧客栈');
		L.nav.setCur('blog');
		var dom = getNewPage();
		o_active_page = L.views.blogDetail(dom, param.id, function (title) {
            lofox.title(title);
        });
	});
	//作品列表页
	lofox.set('/opus', function () {
		this.title('作品_小剧客栈');
		L.nav.setCur('opus');
		var dom = getNewPage();
		o_active_page = L.views.opusList(dom);
	});
	//作品详情页
	lofox.set('/opus/{id}', function (param) {
		this.title('作品_小剧客栈');
		L.nav.setCur('opus');
		var dom = getNewPage();
		o_active_page = L.views.opusDetail(dom, param.id);
	});
	//实验室列表页
	lofox.set('/labs', function () {
		this.title('实验室_小剧客栈');
		
		L.nav.setCur('labs');
		var dom = getNewPage();
		o_active_page = L.views.labsList(dom);
	});
	
	/**
	 * 留言板
	 */
	lofox.set('/bless', function () {
		this.title('留言板_小剧客栈');
		L.nav.setCur('/');
		var dom = getNewPage();
        dom.html('<div class="l-row blessPage"><div class="l-col-12"></div></div>');
        o_active_page = new L.views.comments.init(dom.find('.l-col-12')[0], 'define-1');
	});
	
	/**
	 * 监听视图刷新事件
	 */
	lofox.on('refresh', function (pathData,search) {
        //显示隐藏返回按钮
        if(pathData.length > 1){
            L.nav.back.show();
        }else{
            L.nav.back.hide();
        }
    });
    //视图刷新前，销毁上一个对象
	lofox.on('beforeRefresh',function(){
        if(o_active_page && o_active_page.destory){
            o_active_page.destory();
        }
        o_active_page = null;
    });
	$('body').on('click', 'a[lofox="true"]', function () {
		var url = $(this).attr('href');
		setTimeout(function () {
			lofox.push(url);
			lofox.refresh();
		});
		return false;
	});
}


try {
    console.log("\n\n\n\n\n%c", 'font-size:0;line-height:0;padding:69px 80px 0 0;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABFCAMAAADq1JG3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABhQTFRFr6+vhoaG6urqWlpaJiYm0NDQ////AAAAwk8ZEQAAAhNJREFUeNrMmNuW5CAIRQ8C5f//8ZhLTY8JINHMWs1zahegwgF8YisKYpbdmAlaBj9ACKOGqp01LHQOqHRh/UCZ9CmwgD3cydQnwIarQ2OkgRncjtQUsFDNmlAZAyH1gd2dxNW9R7zmJEJg4frYLmF3QJ3gtbCLB1SpdZmIdV5PxFL+DCLe4LWTuQOpLhmuQKzxqmgPnD+QaxpPINdlo3+BWOd9g96BZVBMCVBFay7hd/wDpIiGki3k+AJ9B+XePIL3zl8gPSrJQcXEAXQdJKcHu4+KDyCSpXPcJbaDhnsHIwngZYk2oBMxxQqFvZjhRMwDDWO70WKG7b3oZySKnDzB/iv6DI3tmGHWGSljoPNDYNJB20VpcnIqg24WYQojzvDsgybzYaYitmNmE4gckEyglQjNAWFWgMlL81+A+uuB+ZCXDuX1a/P6xX796b1eHF4vX2ad5IUCa7cAzJ3x1gLs3jC+2+r0Iq+NjrLoNOatjTpqGBMBb4G5UkTwvCsfUmRCLHmK7hRLnpxzie6IziPBaQtEX8OegjMYUgTl7p6Eo8pQtPdeKmVEezxWyL6gaqaDueJ4r8hNjtvqKzc/IjfbJoCUGx5bwC3iw7Av6rwP++HRDHpbmt1P2c7k30sLr1xGaz0ldouJsyIQirvAdeijeIkxwp0PRqzLim4rJ/Fu0Eb23/cFoB3keMvaRX77/o8AAwCZhYbH8b+xCwAAAABJRU5ErkJggg==");');
    console.log("coding and coding\r\nyear after year\r\n\r\nfollow me https://github.com/bh-lay");
} catch (e) {}