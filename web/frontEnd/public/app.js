/**
 * @author:bh-lay
 * Blog : http://bh-lay.com/
 * Copyright (c) 2012-2018
**/

window.L = window.L || {};

seajs.use('/frontEnd/util/lofox.js',function(){
	var lofox = new util.lofox();
	lofox.router(function(pathData,searchData){
		var routerName = null;
		var pageTile = '';
		var param = {};
		
		var pathLength = pathData.length;
		//判断是否为首页
		if(pathLength == 0){
			pageTile = '小剧客栈_剧中人的个人空间 网页设计师博客 互动设计学习者';
			routerName = 'index';
		}else{
			switch(pathData[0]){
				case 'blog':
					pageTile = '我的博客_小剧客栈';
					if(pathLength == 1){
						routerName = 'blogList';
					}else if(pathLength == 2){
						routerName = 'blogDetail';
						param.id = pathData[1];
					}
				break
				case 'share':
					pageTile = '我的分享_小剧客栈';
					if(pathLength == 1){
						routerName = 'shareList';
					}else if(pathLength == 2){
						routerName = 'shareDetail';
						param.id = pathData[1];
					}
				break
				case 'opus':
					pageTile = '作品_小剧客栈';
					if(pathLength == 1){
						routerName = 'opusList';
					}else if(pathLength == 2){
						routerName = 'opusDetail';
						param.id = pathData[1];
					}
				break
				case 'labs':
					pageTile = '实验室_小剧客栈';
					if(pathLength == 1){
						routerName = 'labsList';
					}else if(pathLength == 2){
						routerName = 'labsDetail';
						console.log(pathData[1],2323);
						param.id = pathData[1];
					}
				break
				default:
			}
		}
		return [routerName,pageTile,param];
	});
	
	var dom = $('.contlayer');
	lofox.set('index',function(){
		L.nav.setCur('/');
		seajs.use('/frontEnd/public/js/index.js',function(indexPage){
			indexPage(dom);
		});
	});
	
	lofox.set('blogList',function(){
		L.nav.setCur('blog');
		seajs.use('/frontEnd/public/js/blogList.js',function(blogList){
			blogList(dom);
		});
	});
	lofox.set('blogDetail',function(id){
		L.nav.setCur('blog');
		seajs.use('/frontEnd/public/js/blogDetail.js',function(blogDetail){
			blogDetail(dom,id);
		});
	});
	
	lofox.set('shareList',function(){
		L.nav.setCur('share');
		seajs.use('/frontEnd/public/js/shareList.js',function(shareList){
			shareList(dom);
		});
	});
	lofox.set('shareDetail',function(param){
		L.nav.setCur('share');
		seajs.use('/frontEnd/public/js/shareDetail.js',function(shareDetail){
			shareDetail(dom,param.id);
		});
	});
	
	lofox.set('opusList',function(){
		L.nav.setCur('opus');
		seajs.use('/frontEnd/public/js/opusList.js',function(opusList){
			opusList(dom);
		});
	});
	lofox.set('opusDetail',function(param){
		L.nav.setCur('opus');
		seajs.use('/frontEnd/public/js/opusDetail.js',function(opusDetail){
			opusDetail(dom,param.id);
		});
	});
	
	lofox.set('labsList',function(){
		L.nav.setCur('labs');
		seajs.use('/frontEnd/public/js/labsList.js',function(labsList){
			labsList(dom);
		});
	});
	lofox.set('labsDetail',function(param){
		L.nav.setCur('labs');
		seajs.use('/frontEnd/public/js/labsDetail.js',function(labsDetail){
			labsDetail(dom,param.id);
		});
	});
	
	lofox.on('change',function(url){
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
	
	L.gallery();
	L.nav();
});



/**
 * L.nav()
 * 
 */
(function(ex){
	var init=function(){
		var isOpen = false;
		$('.nav_moreBtn').click(function(){
			if(isOpen){
				isOpen = false;
				$('.nav_mainList').slideUp(80,function(){
					$(this).height(0).show();
				});
			}else{
				isOpen = true;
				$('.nav_mainList').hide().height('auto').slideDown(120);
			}
		});
		$('.nav_mainList').on('click',function(){
			if($('.nav_moreBtn').css('display') == 'block'){
				isOpen = false;
				$('.nav_mainList').slideUp(80,function(){
					$(this).height(0).show();
				});
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
		'.myCard{position:fixed;width:260px;height:300px;background:#fff;top:60px;left:20%;z-index:100;border-radius:4px;overflow:hidden;box-shadow:0px 0px 100px #000;}',
		'.myCard_header{height:80px;background:#48f;}',
		'.myCard_info{position:absolute;top:35px;left:20px;width:100%;}',
		'.myCard_cover{width:60px;height:60px;margin-right:10px;float:left;background:#333;}',
		'.myCard_cpt{width:150px;float:left;text-shadow:1px 1px 8px #000;}',
		'.myCard_cpt h3{line-height:20px;font-size:16px;color:#fff;font-weight:bold;}',
		'.myCard_cpt p{line-height:20px;font-size:14px;color:#fff;}',
	'</style><div class="myCard">',
		'<div class="myCard_header">',
			
		'</div>',
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
			{'src':'/skin/naive/gallery/bamboo.jpg','alt':'竹子'},
			{'src':'/skin/naive/gallery/coast.jpg','alt':'江边'}
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
	//	console.log('gallery:','use JS animate !');
		var data = data,
			bj = bj,
			total = data.length;
	
		var bjDom = $('<img/>').hide();
	
		bj.html(bjDom);
		show(0,bjDom,data);
		$(window).on('resize',function(){
			fixImg(bjDom)
		});
		
		function fixImg(dom){
			var img = dom;
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
			loadImg(data[i].src,{'loadFn':function(){
				var imgW=arguments[0];
				var imgH=arguments[1];
				bj.fadeOut(1000,function(){
					dom.attr({'src':data[i].src,'alt':data[i].alt||'','data':(imgW+'-'+imgH)});
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
	//	console.log('gallery:','use css3 mask and animate!');
		var data = data,
			isWebkit = false,
			bj = bj,
			total = data.length;
		bj.html('');
		show(0);
		
		if(supports('webkitAnimation')){
	//		console.log('gallery:','support -webkit-animation');
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
	//	console.log('gallery:','start !');
		var bj = $('.gallayer .galBj'),
			data = config['coverData'];
		if (supports('backgroundSize')){
			CSS3(data,bj);
		}else{
			JS_show(data,bj);
		}
	}
}(L));