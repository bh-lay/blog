/**
 * @author:bh-lay
 * Blog : http://bh-lay.com/
 * Copyright (c) 2012-2018
**/

(function(){
	var browser = navigator.appName 
	var b_version = navigator.appVersion 
	var version = b_version.split(";"); 
	var trim_Version = version[1] ? version[1].replace(/[ ]/g,"") : ''; 
	var isIe678 = false;
	if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0"){
		isIe678 = true;
	} else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0"){
		isIe678 = true;
	}else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"){
		isIe678 = true;
	}
	
	if(isIe678){
		window.location.href = '/topic/notSupport.html';
	}
})();


//删除为搜索引擎提供的dom
$('.sourceCode').remove();

//增加github图片
$('body').append('<a href="https:github.com/bh-lay/blog" target="_blank" class="github-link"></a>');


window.L = window.L || {};

/**
 *使用七牛云存储
 * 若url为绝对地址，则使用源图，且不处理剪裁缩放
 * L.qiniu(url,config);
 */
(function(exports){
	var baseDomain = app_config.imgDomain;
	exports.qiniu = function(url){
		if(!url || url.length == 0){
			return url;
		}else if(url[0] == '/'){
			return baseDomain + url;
		}else{
			return url;
		}
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
	'lib/md5.js',
	'UI/dialog.js'
],function(){
	var lofox = new util.lofox();
	var dom = $('.contlayer');
	var activeCover = null;
	var basePage;
	function ani(){
		var oldDom = dom.find('.contlayer_body');
		var newDom = $('<div class="contlayer_body"><div class="contlayer_loading">正在加载</div></div>');
		if(oldDom.length != 0){
			oldDom.css({
				'position' : 'absolute',
				'overflow': 'hidden'
			});
			newDom.hide();
			oldDom.animate({
				'top': '100%'
			},400,function(){
				oldDom.remove();
				dom.append(newDom);
				newDom.fadeIn(100,function(){
					newDom.css('position','relative');
				});
			});
		}else{
			dom.append(newDom);
		}
		return newDom;
	}
	/**
	 * 首页
	 */
	lofox.set('/',function(){
		basePage = 'index';
		this.title('小剧客栈_剧中人的个人空间 网页设计师博客 互动设计学习者');
		L.nav.setCur('/');
		var dom = ani();
		
		seajs.use('public/js/index.js',function(indexPage){
			indexPage(dom);
		});
	});
	/**
	 * 博文列表
	 */
	lofox.set('/blog',function(){
		basePage = 'indexList';
		this.title('我的博客_小剧客栈');
		L.nav.setCur('blog');
		var dom = ani();
		seajs.use('public/js/blogList.js',function(blogList){
			blogList(dom);
		});
	});
	/**
	 * 博客详细页
	 */
	lofox.set('/blog/{id}',function(param){
		this.title('我的博客_小剧客栈');
		L.nav.setCur('blog');
		activeCover = UI.cover({
			'from' : 'bottom',
			'width' : 900,
			'mask' : true,
			'closeFn' : function(){
				activeCover = null;
				lofox.push('/blog');
				if(basePage != 'indexList'){
					lofox.refresh();
				}
			}
		});
		seajs.use('public/js/blogDetail.js',function(blogDetail){
			blogDetail($(activeCover.cntDom),param.id,function(title){
				lofox.title(title);
			});
		});
	});
	/**
	 * 我的分享列表
	 */
	lofox.set('/share',function(){
		basePage = 'shareList';
		this.title('我的分享_小剧客栈');
		L.nav.setCur('share');
		var dom = ani();
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
		
		activeCover = UI.cover({
			'from' : 'bottom',
			'width' : 900,
			'mask' : true,
			'closeFn' : function(){
				activeCover = null;
				lofox.push('/share');
				if(basePage != 'shareList'){
					lofox.refresh();
				}
			}
		});
		
		seajs.use('public/js/shareDetail.js',function(shareDetail){
			shareDetail($(activeCover.cntDom),param.id);
		});
	});
	
	//作品列表页
	lofox.set('/opus',function(){
		this.title('作品_小剧客栈');
		L.nav.setCur('opus');
		var dom = ani();
		seajs.use('public/js/opusList.js',function(opusList){
			opusList(dom);
		});
	});
	//作品详情页
	lofox.set('/opus/{id}',function(param){
		this.title('作品_小剧客栈');
		L.nav.setCur('opus');
		var dom = ani();
		seajs.use('public/js/opusDetail.js',function(opusDetail){
			opusDetail(dom,param.id);
		});
	});
	//实验室列表页
	lofox.set('/labs',function(){
		basePage = 'labsList';
		
		this.title('实验室_小剧客栈');
		
		L.nav.setCur('labs');
		var dom = ani();
		seajs.use('public/js/labsList.js',function(labsList){
			labsList(dom);
		});
	});
	//实验室详情页
	lofox.set('/labs/{id}',function(param){
		this.title('实验室_小剧客栈');

		activeCover = UI.cover({
			'from' : 'bottom',
			'mask' : true,
			'html' : '<iframe class="UI-plugin-iframe" src="/labs/' + param.id + '"></iframe>',
			'closeFn' : function(){
				activeCover = null;
				lofox.push('/labs');
				if(basePage != 'labsList'){
					lofox.refresh();
				}
			}
		});
	});
	//留言板
	lofox.set('/demo/bless.html',function(param){
		this.title('留言板_小剧客栈');
		L.nav.setCur('');
		var dom = ani();
		dom.html(['<div class="l_row"><div class="l_col_12"><div style="background: #fff;margin:100px auto 50px;padding:20px;border-radius :8px;">',
			'<div id="uyan_frame"></div>',
			'<script type="text/javascript">var uyan_config = {"du":"bh-lay.com"};</script>',
			'<script type="text/javascript" id="UYScript" src="http://v1.uyan.cc/js/iframe.js?UYUserId=1605927" async=""></script>',
		'</div></div></div>'].join(''));
	});
	
	/**
	 * 留言板2
	 */
	lofox.set('/bless',function(){
		basePage = 'indexList';
		this.title('留言板_小剧客栈');
		L.nav.setCur('blog');
		var dom = ani();
		seajs.use('comments/index.js',function(comments){
			dom.html('<div class="l_row"><div class="l_col_12"></div></div>');
			new comments.init(dom.find('.l_col_12')[0],'define-1');
		});
	});
	
	/**
	 * 监听页面跳转
	 */
	lofox.on('change',function(url){
		if(activeCover){
			activeCover.closeFn = null;
			activeCover.close();
			activeCover = null;
		}
		
		delete(uyan_c_g);
		delete(uyan_loaded);
		delete(uyan_s_g);
		delete(uyan_style_loaded);
		delete(uyan_style_loaded_over);
		window.uyan_config = window.uyan_config || {"du":"bh-lay.com"};
	});
	
	$('body').on('click','a[lofox="true"]',function(){
		var url = $(this).attr('href');
		setTimeout(function(){
			lofox.push(url);
			lofox.refresh();
		},20);
		return false;
	});
	L.push = function(url){
		lofox.push(url)
	}
	L.gallery();
	L.nav();
});




/**
 * L.nav()
 * 
 */
(function(ex){
	var init=function(){
		var tips = null;
		$('.nav_tool a').click(function(){
			if($('.navLayer').hasClass('nav_slidedown')){
				$('.navLayer').removeClass('nav_slidedown');
			}else{
				$('.navLayer').addClass('nav_slidedown');
			}
		});
		
		$('.nav_main a').each(function(){
		  $(this).attr('title','')
		});
		
		$('.nav_main').on('click',function(){
			if($('.navLayer').hasClass('nav_slidedown')){
				$('.navLayer').removeClass('nav_slidedown');
			}else{
				//貌似不需要else
			}
		});
	};

	var setCur = function(page){
		if(page == '/'){
			page = 'index';
		}
		$('.navLayer .nav li').removeClass('cur');
		$('.navLayer .nav li[page='+page+']').addClass('cur');
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
	var supports = (function() {
   	var div = document.createElement('div'),
	      vendors = 'Khtml Ms O Moz Webkit'.split(' '),
	      len = vendors.length;
	  
	   return function(prop) {
	      if ( prop in div.style ){
	      	return true;
	      }
	  
	      prop = prop.replace(/^[a-z]/, function(val) {
	         return val.toUpperCase();
	      });
	
			for(var i = 0; i<len; i++){
				if ( vendors[len] + prop in div.style ) {
	            // browser supports box-shadow. Do what you need.
	            // Or use a bang (!) to test if the browser doesn't.
	            break 
	            return true;
	         }
			}
	      return false;
	   };
	})();
	
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
	function JS_show(data,bj){
		var data = data,
			bj = bj,
			total = data.length;
	
		var bjDom = $('<img/>').hide();
	
		bj.html(bjDom);
		show(0,bjDom,data);
		$(window).on('resize',function(){
			fixImg(bjDom);
		});
		
		function fixImg(img){
			var size = img.attr('data').split('-');
			var imgW = size[0];
			var imgH = size[1];
			var winW = $(window).width();
			var winH = $(window).height();
			if(winW/winH > imgW/imgH){
				img.css({
					'width':winW,
					'height':winW*imgH/imgW,
					'marginTop':-(winW*imgH/imgW-winH)/2,
					'marginLeft':0
				});
			}else{
				img.css({
					'width':winH*imgW/imgH,
					'height':winH,
					'marginTop':0,
					'marginLeft':-(winH*imgW/imgH-winW)/2
				});
			}
		}
		function show(i,dom,data){
			loadImg(data[i].src,{'loadFn':function(imgW,imgH){
				
				bj.fadeOut(1000,function(){
					dom.attr({
						'src' : data[i].src,
						'alt' : data[i].alt || '',
						'data' : (imgW+'-'+imgH)
					});
					fixImg(dom);
					bj.fadeIn(800);
					setTimeout(function(){
						i++;
						i==total&&(i=0);
						show(i,dom,data);
					},config.delay)
				});
			}});
		}
	}
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
		var bj = $('.gallayer .galBj'),
			data = config['coverData'];
		if (supports('backgroundSize')){
			CSS3(data,bj);
		}else{
			JS_show(data,bj);
		}
	}
}(L));