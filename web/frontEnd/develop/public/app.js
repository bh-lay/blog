/**
 * @author:bh-lay
 * Blog : http://bh-lay.com/
 * Copyright (c) 2012-2018
**/

window.L = window.L || {};

(function(){
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
	
	//屌丝就用屌丝版
	if (!isAdvancedBrowser) {
		document.cookie = 'ui_version=html;path=/;';
		window.location.reload();
	}
    L.supports = {
        touch : isSupportTouch,
        css: supports
    };
	L.isMobileBrowser = (window.innerWidth < 720 && isSupportTouch) ? true : false;
}());

define(function (require, exports) {
	require('public/js/juicer.js');
	require('util/lofox_1_0.js');
	require('UI/dialog.js');
	require('public/js/nicescroll.js')(jQuery);
    
    //绑定路由
    var lofox = new util.lofox();
    routerHandle(lofox);
    
    L.user = require('public/js/user.js');
    L.gallery = require('public/js/page_background.js');
    L.nav = require('public/js/navigation.js');
    L.views = {
        index : require('public/js/index.js'),
        blogList : require('public/js/blogList.js'),
        blogDetail : require('public/js/blogDetail.js'),
        labsList : require('public/js/labsList.js'),
        bless : require('public/js/bless.js'),
        comments : require('public/comments/index.js')
    };
	L.push = function (url) {
		lofox.push(url);
	};
	L.refresh = function () {
		lofox.refresh();
	};
  //模块替换
  L.tplModule = function(txt){
    return (txt && txt.length) ? txt.replace(/\[\-(\w+)\-\]/g,function(a,key){
      return $('#module_' + key).html() || '';
    }) : '';
  };
	/**
	 * @param (timestamp/Date,'{y}-{m}-{d} {h}:{m}:{s}')
	 * @param (timestamp/Date,'{y}-{mm}-{dd} {hh}:{mm}:{ss}')
	 * 
	 * y:year
	 * m:months
	 * d:date
	 * h:hour
	 * i:minutes
	 * s:second
	 * a:day
	 */
	L.parseTime = function (time,format){
		if(arguments.length==0){
			return null;
		}
		var format = format ||'{y}-{m}-{d} {h}:{i}:{s}';

		if(typeof(time) == "object"){
			var date = time;
		}else{
			var date = new Date(parseInt(time));
		}

		var formatObj = {
			y : date.getYear()+1900,
			m : date.getMonth()+1,
			d : date.getDate(),
			h : date.getHours(),
			i : date.getMinutes(),
			s : date.getSeconds(),
			a : date.getDay(),
		};

		var time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g,function(result,key){
			var value = formatObj[key];
			if(result.length > 3 && value < 10){
				value = '0' + value;
			}
			return value || 0;
		});
		return time_str;
	}
  //配置弹出层
  UI.config.zIndex(2000);

  //显示背景图
  if (L.supports.css('backgroundSize') && !L.isMobileBrowser) {
    new L.gallery({
      delay : 50000,
      data : [
        {
          src : app_config.frontEnd_base + 'public/images/gallery/bamboo.jpg',
          alt : '竹子'
        },
        {
          src : app_config.frontEnd_base + 'public/images/gallery/coast.jpg',
          alt : '江边'
        }
      ]
    });
  }
  //开始导航
  L.nav();
  //渐隐加载遮罩
  $('.app_mask').addClass('app_mask_out'); 
  setTimeout(function () {
    $('.app_mask').remove();
  }, 1000);
  
	/**
	 * 检测链接是否为提供给js使用的地址
   *   无地址、 javascript:: 、javascript:void(0)、#
	 **/
	function hrefForScript(href){
		return (href.length == 0 || href.match(/^(javascript\s*\:|#)/)) ? true : false;
	}
  /**
   * 分享功能
   *  data-text data-url data-title data-img data-shareto
   */
  $('body').on('click','.sns-share a',function(){
    var $data = $(this).parents('.sns-share'),
        url = $data.attr('data-url') || location.href,
        text = encodeURIComponent($data.attr('data-text')) || document.title,
        title = encodeURIComponent($data.attr('data-title')),
        img = $data.attr('data-img'),
        shareto = $(this).attr('data-shareto');

    img = img ? L.qiniu(img) : '';
    var share_url={
      weibo: 'http://service.weibo.com/share/share.php?title='+text+'+&url='+url+'&source=bookmark&appkey=2861592023&searchPic=false&pic='+img,
      qzone: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary='+text+'&url='+url+'&title='+ title+'&pics='+img+'&desc='+text
    };
    share_url[shareto] && window.open(share_url[shareto]);
    return false;
  })
  //处理火狐，js链接新窗口打开问题，感谢 @紫心蕊 
  .on('click','a',function(e){
      if(hrefForScript($(this).attr('href'))){
          e.preventDefault();
      }
  })
  //nicescrol
  .niceScroll({
      zindex : 2001,
      cursorborder: '1px solid rgba(255,255,255,.2)',
      mousescrollstep: 60,
      railpadding: {
          right : 1
      },
      bouncescroll: true
  });
  //动态插入emoji表情样式
  var str = '';
  $('#data_emoji').html()
  .replace(/^\s+|\s+$/g,'')
  .split(/\s+/)
  .forEach(function(item,index){
    str += '.emoji.s_' + item + '{background-position: -' + (index * 25) + 'px 0;}';
  });
  $('head').append('<style type="text/css" data-module="emoji">' + str + '</style>');
});

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
	//显示单页dom
	function getNewPage() {
		var newDom = $('<div class="page"><div class="l-loading-panel"><span class="l-loading"></span><p>正在加载模块</p></div></div>');
    //移除老的page dom
    if ($active_page) {
      var $old = $active_page;
			$active_page = null;
			$old.addClass('fadeOutRight');
			setTimeout(function () {
				$old.remove();
        $('html,body').scrollTop(0);
        newDom.addClass('fadeInLeft page-active');
        setTimeout(function () {
          newDom.removeClass('fadeInLeft');
        }, 500);
			}, 500);
		} else {
        newDom.addClass('page-active');
    }
    container.append(newDom);
		$active_page = newDom;
		return newDom;
	}
	
    //视图刷新前，销毁上一个对象
	lofox.on('beforeRefresh',function(){
        if(o_active_page && o_active_page.destroy){
            o_active_page.destroy();
        }
        o_active_page = null;
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
		
		o_active_page = new L.views.blogList(dom, search);
	});
	/**
	 * 博客详细页
	 */
	lofox.set('/blog/{id}', function (param) {
		this.title('我的博客_小剧客栈');
		L.nav.setCur('blog');
		var dom = getNewPage();
		o_active_page = new L.views.blogDetail(dom, param.id, function (title) {
      lofox.title(title);
    });
	});
	//实验室列表页
	lofox.set('/labs', function () {
		this.title('实验室_小剧客栈');
		
		L.nav.setCur('labs');
		var dom = getNewPage();
		o_active_page = new L.views.labsList(dom);
	});
	
	/**
	 * 留言板
	 */
	lofox.set('/bless', function () {
		this.title('留言板_小剧客栈');
		L.nav.setCur('bless');
		var dom = getNewPage();
       
        o_active_page = new L.views.bless(dom);
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