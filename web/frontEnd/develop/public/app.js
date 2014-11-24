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
		var returns = false;
		if ( prop in styles ){
			returns = prop;
		}else{
			prop = prop.replace(/^[a-z]/, function(val) {
				return val.toUpperCase();
			});
			for(var i=0,total=vendors.length;i<total;i++){
				if ( vendors[i] + prop in styles ) {
					returns = ('-' + vendors[i] + '-' + prop).toLowerCase();
				}
			}
		}
		return returns;
	};
})();
/**
 * 是否支持 canvas
 */
function supports_canvas() {
  return !!document.createElement('canvas').getContext;
}
/**
 * 检测是否为高级浏览器
 *
 */
function isAdvancedBrowser(){
	if(supports('transition') && supports('transform') && supports_canvas()){
		return true;
	}else{
		return false;
	}
}
/**
 * 检测是否为手机浏览器
 *
 */
var isMobileBrowser = $(window).width() < 720 ? true : false;

//屌丝就用屌丝版
if(!isAdvancedBrowser()){
	document.cookie = 'ui_version=j1s;path=/;max-age=0';
	window.location.reload();
}

window.L = window.L || {};

/**
 *使用七牛云存储
 * 若url为绝对地址，则使用源图，且不处理剪裁缩放
 * L.qiniu(url,config);
 */
(function(exports){
	function cover(url,config){
		w = config.width || config.height;
		h = config.height || config.width;
		return url + '?imageView/1/w/' + w + '/h/' + h + '/q/85';
	}
	function zoom(url,config){
		var confStr;
		if(config.width){
			confStr = 'w/' + config.width
		}else{
			confStr = 'h/' + config.height
		}
		
		return url + '?imageView2/2/' + confStr + '/q/85';
	}
	var baseDomain = app_config.imgDomain;
	exports.qiniu = function(url,config){
		var src = url;
		if(typeof(url) == 'string' && url.length > 0 && url[0] == '/'){
			src = baseDomain + url
			if(config){
				if(config.type == "zoom"){
					src = zoom(src,config);
				}else{
					//config.type == "cover"
					src = cover(src,config);
				}
			}
		}
		return src;
	}
})(L);

/**
 * 模版引擎生成器
 * L.tplEngine(str)
 */
(function(exports){
	exports.tplEngine = function (str){
		if(!str){
			return;
		}
		return new Function("obj",
			"var p=[];" +
			"with(obj){p.push('" +
			str
			.replace(/[\r\t\n]/g, " ")
			.split("<%").join("\t")
			.replace(/((^|%>)[^\t]*)'/g, "$1\r")
			.replace(/\t=(.*?)%>/g, "',$1,'")
			.split("\t").join("');")
			.split("%>").join("p.push('")
			.split("\r").join("\\'")
		+ "');}return p.join('');");
	};
})(L);


seajs.use([
	'util/lofox_1_0.js',
	'public/base/user.js',
	'lib/juicer.js',
	'lib/md5.js',
	'UI/dialog.js'
],function(){
	var lofox = new util.lofox();
	var dom = $('.contlayer');
	
	var $active_page = null;
	//移除老的page dom
	function removePageDom(callback){
		if($active_page){
            var $old = $active_page;
			$active_page = null;
			$old.addClass('fadeOutRight');
			setTimeout(function(){
				$old.remove();
                $('html,body').scrollTop(0);
                callback && callback();
			},500);
		}else{
            callback && callback();
        }
	}
	var container = $('.app_container');
	//显示单页dom
	function getNewPage(){
		var newDom = $('<div class="page"><div class="l-loading-panel"><span class="l-loading"></span><p>正在加载模块</p></div></div>');
        removePageDom(function(){
            container.append(newDom);
            newDom.addClass('fadeInLeft');
        });
		$active_page = newDom;
		return newDom;
	}
	
	/**
	 * 首页
	 */
	lofox.set('/',function(){
		this.title('小剧客栈_剧中人的个人空间 网页设计师博客 互动设计学习者');
		L.nav.setCur('/');
		var dom = getNewPage();
		
		seajs.use('public/js/index.js',function(indexPage){
			indexPage(dom);
		});
	});
	/**
	 * 博文列表
	 */
	lofox.set('/blog',function(param,pathnde,search){
		this.title('我的博客_小剧客栈');
		L.nav.setCur('blog');
		var dom = getNewPage();
		
		seajs.use('public/js/blogList.js',function(blogList){
			blogList(dom,search);
		});
	});
	/**
	 * 博客详细页
	 */
	lofox.set('/blog/{id}',function(param){
		this.title('我的博客_小剧客栈');
		L.nav.setCur('blog');
		var dom = getNewPage();
		seajs.use('public/js/blogDetail.js',function(blogDetail){
			blogDetail(dom,param.id,function(title){
				lofox.title(title);
			});
		});
	});
	/**
	 * 我的分享列表
	 */
	lofox.set('/share',function(){
		this.title('我的分享_小剧客栈');
		L.nav.setCur('share');
		var dom = getNewPage();
		seajs.use('public/js/shareList.js',function(shareList){
			shareList(dom);
		});
	});
	/**
	 * 我的分享详细
	 */
	lofox.set('/share/{id}',function(param){
		this.title('我的分享_小剧客栈');
		L.nav.setCur('share');
		var dom = getNewPage();

		seajs.use('public/js/shareDetail.js',function(shareDetail){
			shareDetail(dom,param.id);
		});
	});
	
	//作品列表页
	lofox.set('/opus',function(){
		this.title('作品_小剧客栈');
		L.nav.setCur('opus');
		var dom = getNewPage();
		seajs.use('public/js/opusList.js',function(opusList){
			opusList(dom);
		});
	});
	//作品详情页
	lofox.set('/opus/{id}',function(param){
		this.title('作品_小剧客栈');
		L.nav.setCur('opus');
		var dom = getNewPage();
		seajs.use('public/js/opusDetail.js',function(opusDetail){
			opusDetail(dom,param.id);
		});
	});
	//实验室列表页
	lofox.set('/labs',function(){		
		this.title('实验室_小剧客栈');
		
		L.nav.setCur('labs');
		var dom = getNewPage();
		seajs.use('public/js/labsList.js',function(labsList){
			labsList(dom);
		});
	});
	
	/**
	 * 留言板
	 */
	lofox.set('/bless',function(){
		this.title('留言板_小剧客栈');
		L.nav.setCur('/');
		var dom = getNewPage();
		seajs.use('comments/index.js',function(comments){
			dom.html('<div class="l_row blessPage"><div class="l_col_12"></div></div>');
			new comments.init(dom.find('.l_col_12')[0],'define-1');
		});
	});
	
	/**
	 * 监听页面跳转
	 */
	//lofox.on('change',function(url){});
	
	$('body').on('click','a[lofox="true"]',function(){
		var url = $(this).attr('href');
		setTimeout(function(){
			lofox.push(url);
			lofox.refresh();
		});
		return false;
	});
	
	
	L.push = function(url){
		lofox.push(url)
	};
	L.refresh = function(){
		lofox.refresh()
	};
	L.gallery();
	L.nav();
});




/**
 * L.nav()
 * 
 */
(function(ex){
	var init=function(){
        $('.nav_moreBtn').click(function(){
             $('body').toggleClass('nav_slidedown');
		});
		$('.app_nav .nav a').click(function(){
			$('body').removeClass('nav_slidedown');
		});
		
		$('.nav_body a').each(function(){
		  $(this).attr('title','')
		});
		
		$('.nav_mask').on('click',function(){
			$('body').removeClass('nav_slidedown');
		});
		var active_pop;
		$('.nav_setting').click(function(){
			if(active_pop){
				return;
			}
			var offset = $(this).offset();
			active_pop = UI.pop({
				'title' : '设置',
				'from': $(this)[0],
				'width': 400,
				'html': '<div class="setting_pop"><a class="backToOldVersion" href="javascript:void(0)">回到屌丝版</a></div>',
				'closeFn': function(){
					active_pop = null;
				}
			});
			
			$(active_pop.dom).on('click','.backToOldVersion',function(){
				document.cookie = 'ui_version=j1s;path=/;max-age=0';
				window.location.reload();
			});
		});
	};

	var setCur = function(page){
		if(page == '/'){
			page = 'index';
		}
		$('.app_nav .nav li').removeClass('cur');
		$('.app_nav .nav li[page='+page+']').addClass('cur');
	};
	ex.nav = init;
	ex.nav.setCur = setCur;
})(L);

/**
 *
 * 
 */
(function(exports){
	var tpl = ['<style>',
		'.myCard{position:fixed;width:260px;height:300px;background:#fff;top:60px;left:20%;z-index:100;border-radius:4px;overflow:hidden;box-shadow:0px 0px 100px rgba(0,0,0,0.2);}',
		'.myCard_header{height:80px;background:#48f;}',
		'.myCard_info{position:absolute;top:35px;left:20px;width:100%;}',
		'.myCard_cover{width:60px;height:60px;margin-right:10px;float:left;background:#333;}',
		'.myCard_cpt{width:150px;float:left;text-shadow:1px 1px 8px #000;}',
		'.myCard_cpt h3{line-height:20px;font-size:16px;color:#fff;font-weight:bold;}',
		'.myCard_cpt p{line-height:20px;font-size:14px;color:#fff;}',
	'</style><div class="myCard">',
		'<div class="myCard_header"></div>',
		'<div class="myCard_info">',
			'<div class="myCard_cover">',
			'</div>',
			'<div class="myCard_cpt">',
				'<h3>剧中人</h3>',
				'<p>前端工程师</p>',
			'</div>',
		'</div>',
		
	'</div>'].join('');
	var card = function(){
		$('body').append(tpl);
	};
	exports.myCard = function(){
		return new card();
	};
})(L);


/**
 * page background
 * L.gallery() 
 */
(function(ex){
	var config = {
		'delay' : 50000,
		'coverData' : [
			{'src': app_config.frontEnd_base + 'public/images/gallery/bamboo.jpg','alt':'竹子'},
			{'src': app_config.frontEnd_base + 'public/images/gallery/coast.jpg','alt':'江边'}
		]
	};
	
	function loadImg(src,parm){
		var parm = parm||{},
			loadFn = parm['loadFn'] || null,
			sizeFn = parm['sizeFn'] || null,
			errorFn = parm['errorFn'] || null;
		
		var img = new Image();
		if(errorFn){
			img.onerror = function(){
				errorFn();
			}
		};
		if(loadFn){
			img.onload = function(){
				loadFn(img.width,img.height);
			}
		}
		if(sizeFn){
			var timer = setInterval(function(){
				if(img.width>1){
					clearInterval(timer);
					sizeFn(img.width,img.height);
				}
			},2);
		}
		img.src=src;
	};
	function CSS3(data,bj){
		var data = data,
			isWebkit = false,
			bj = bj,
			total = data.length;
		bj.html('');
		show(0);
		
		if(supports('webkitAnimation')){
			isWebkit = true;
		}
		
		function show(index){
			var index = index,
				src = data[index].src;
			loadImg(src,{'loadFn':function(){
				var newPic = $('<div class="galBj_mask"></div>');
				newPic.css({'backgroundImage' : 'url(' + src + ')'});
				bj.html(newPic);
				
				if(!isWebkit){
					newPic.hide().fadeIn(1000);
				}

				setTimeout(function(){
					bj.css({'backgroundImage' : 'url(' + src + ')'});
					newPic.hide()
					index++;
					index == total&&(index=0);
					show(index);
				},config.delay);
			}});
		}
	}
	ex.gallery = function(){
		if (!supports('backgroundSize') || isMobileBrowser){
            return
        }
        
		var $gallery = $('<div class="gallayer"><div class="galBj"></div><div class="galMask"></div></div>').hide();
            $bj = $gallery.find('.galBj'),
			data = config['coverData'];
        $('body').prepend($gallery);
        $gallery.fadeIn(200);
        CSS3(data,$bj);
	}
}(L));