/**
 * @author:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/

var L=L||{};

//test css suports
L.supports = (function() {
   var div = document.createElement('div'),
      vendors = 'Khtml Ms O Moz Webkit'.split(' '),
      len = vendors.length;
  
   return function(prop) {
      if ( prop in div.style ) return true;
  
      prop = prop.replace(/^[a-z]/, function(val) {
         return val.toUpperCase();
      });
  
      while(len--) {
         if ( vendors[len] + prop in div.style ) {
            // browser supports box-shadow. Do what you need.
            // Or use a bang (!) to test if the browser doesn't.
            return true;
         }
      }
      return false;
   };
})();

/**
 *load image
 * 	L.loadImg(src,{'loadFn','sizeFn'})
 */
(function(ex){
	var init=function (src,parm){
		var parm=parm||{};
		var img=new Image();
		if(parm.loadFn){
			img.onload=function(){
				parm.loadFn(img.width,img.height);
			}
		}
		if(parm.sizeFn){
			var timer=setInterval(function(){
				
				
			})
		}
		
		img.src=src;
	}
	ex.loadImg=init;	
}(L));

/*
 * L.tool
 * --L.tool.urlParm
 * --L.tool.placehold
 */
(function(ex){
	/*域名获取参数*/
	var urlParm=function(url){
	   var url = url||location.search;
	   var parm = new Object();
	   if (url.indexOf("?") != -1) {
	      var str = url.substr(1);
	      strs = str.split("&");
	      for(var i = 0; i < strs.length; i ++) {
	         parm[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
	      }
	   }
	   return parm;
	}
	var placehold=function(){
		
	}
	ex.urlParm=urlParm;
	ex.placehold=placehold;
}(L.tool=L.tool||{}));
/*
 * 弹框
 * L.dialog
 *   L.dialog.tips({'html','width','text'});
 */
(function(ex){
	var pop=function (parm){
		var parm=parm||{},
		w=parm.width||300,
		h=parm.height||'auto',
		title=parm.title||'标题',
		html=parm.html||'请填写内容参数',
		fn=parm.callBack,
		t=parm.top||$(window).scrollTop()+200,
		l=parm.left||300;
		var pop=$('<div class="diaPop"><div class="diaPopCpt"></div><div class="diaPopCnt"></div></div>');
		pop.find('.diaPopCpt').html(title);
		pop.find('.diaPopCnt').html(html);
		pop.find('.layClose').click(function(){
			$(this).parent().remove();
		});
		pop.css({'width': w,'height':h,'top':t,'left':l});
		$('body').append(pop);
		pop.find('.popWinBody').css({'width': w-10,'height':h-10});
		pop.fadeIn('300');
		fn&&fn();
	}
	var tips=function (parm){
		var parm=parm||{},
			text=parm.text||'请填写提示文本',
			fn=parm.callBack,
			t=parm.top||$(window).scrollTop()+200,
			l=parm.left||300,
			delay=parm.delay||2000;
		var pop=$('<div class="diaTips"><div class="diaTipsCnt"></div></div>');
		pop.find('.diaTipsCnt').html(text);
		pop.css({'top':t,'left':l});
		$('body').append(pop);
		pop.fadeIn(100,function(){
			fn&&fn();
		});
		setTimeout(function(){
			pop.fadeOut(300,function(){
				pop.remove();
			});
		},delay)
	}
	ex.pop=pop;
	ex.tips=tips;
})(L.dialog = L.dialog||{});



/*
 * page background
 * L.gallery() 
 */
(function(ex){
	function JS_show(data,gal,bj){
		var data = data,
			gal = gal,
			bj = bj,
			total = data.length;
	
		var bjDom = $('<img src="/skin/naive/loading_31.gif" width="54" height="55" style="margin-top:160px;margin-left:100px;" data="100-20"/>');
	
		L.loadImg("/skin/naive/loading_31.gif",{'loadFn':function(){
			bj.html(bjDom);
			show(0,bjDom,data);
			$(window).on('resize',function(){
				fixImg(bjDom)
			});
		}});
		
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
			L.loadImg(data[i].src,{'loadFn':function(){
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
					},40000)
				});
			}});
		}
	}
	function CSS3(data,gal,bj){
		var data = data,
			gal = gal,
			bj = bj,
			total = data.length;
		bj.html('');
		show(0);
		
		function show(index){
			var index = index,
				src = data[index].src;
			L.loadImg(src,{'loadFn':function(){
					bj.css({
						'width' : '100%',
						'height' : '100%',
						'backgroundImage' : 'url(' + src + ')',
						'backgroundSize' : 'cover',
						'backgroundPosition' : 'center center',
						'transition' : '1s'
					});
					setTimeout(function(){
						index++;
						index == total&&(index=0);
						show(index);
					},40000)
			}});
		}
	}
	ex.gallery = function(){
		var gal = $('.gallayer'),
			bj = gal.find('.galBj'),
			data = eval('('+bj.html()+')');
		if (L.supports('backgroundSize')&&false){
			CSS3(data,gal,bj);
			console.log('use css3')
		}else{
			JS_show(data,gal,bj);
		}
	}
}(L));

/*
 * L.nav()
 * 
 */
(function(ex){
	var init=function(page){
		var delay;
		switch(page){
			case 'index':
				page = 'index';
			break
			case 'artList':
			case 'article':
				page = 'blog';
			break
			case 'shareList':
			case 'shareDetail':
				page = 'share';
			break 
			case 'opusList':
			case 'opusDetail':
				page = 'opus';
		}
		$('.navLayer .nav li[page='+page+']').addClass('cur');
		$('.navLayer').fadeTo(100,0.6).mouseenter(function(){
			clearTimeout(delay);
			var __=$(this);
			delay=setTimeout(function(){
				__.stop().fadeTo(20,1);			
			},20);
		}).mouseleave(function(){
			clearTimeout(delay);
			var __=$(this);
			delay=setTimeout(function(){
				__.stop().fadeTo(800,0.6);
			},300);
		});
	}
	ex.nav=init;
})(L);
/*
 * set like
 *   used in blog share opus
 */
(function(ex){
	var init=function(type,id,obj){
		$.get('/ajax/......',{'act':'like','type':type,'id':id},function(data){
			var r=data.split('|');
			if(r.length!=1){
				//成功
				if(r[0]!=''){
					L.dialog.tips({'width':'200','html':'成功啦，灰常感谢！','callBack':function(){
						obj.html(r[0])
					}});
				}else if(r[2]!=''){//已经提交
					L.dialog.tips({'width':'200','html':'你已经点过人家啦，换一篇文章吧！','callBack':function(){obj.html(r[0])}});
				}
			}else{
				L.pop({'width':'200','html':r[0]});
			}
		});
	}
	ex.like=init;
}(L));
/*
 * L.a2Fn(dom,url,fn)
 */
(function(ex){
	var transform=function(dom,url,fn){
		var dom=dom||$('body');
		dom.find('a').each(function(){
			var __=$(this);
			if(__.attr('href')==url){
				__.attr('href','javascript:void(0)');
				__.on('click',fn);
			}
		});
		
	}
	ex.a2Fn=transform;
})(L);

/*
 * nav bar
 */
(function(ex){
	var init=function(){
		var mod=$('.indexNav');
		var btnMod=mod.find('.inNavBtn span');
		var cntMod=mod.find('.inNavCnt .inNavCntItem');
		var moving=false;
		var oldIndex=null;
		var delay;
		btnMod.on('mousemove',function(){
			var s=$(this).index();
			if(moving||oldIndex==s){ return; }
			moving=true;
			btnMod.eq(oldIndex).removeClass('active')
			btnMod.eq(s).addClass('active')
			cntMod.eq(oldIndex).slideUp(80,function(){
				cntMod.eq(s).slideDown(120,function(){
					oldIndex=s;
					moving=false;
				});
			});
		});
		mod.on('mouseenter',function(){
			clearTimeout(delay);
		}).on('mouseleave',function(){
			delay=setTimeout(function(){
				btnMod.removeClass('active');
				cntMod.slideUp(200,function(){
					moving=false;
					oldIndex=null;
				});
			},200);
		})
	}
	ex.indexNav=init;
})(L);



/*
 * lantern graphic 
 * L.lantern(pic dom);
 */
(function(ex){
	var tpl = "<div class='lay_show'><div class='lay_exist'>X</div><div class='lay_img'><img alt='' src='' /><div class='lay_title'></div><div class='lay_over'>已经到达列表终点，点击继续浏览</div></div><a class='lay_prev'>《</a><a class='lay_next'>》</a></div>";
	var init = function (dom){
		var imgData=[];
		
		if($('.lay_show').length==0){
			$('body').append(tpl);
		}
		var imgList = dom;
		var bigPic = $('.lay_show>.lay_img>img');
		var total=imgList.length;
		var i, width, height, marginT, src, alt,timer;
		imgList.css({cursor:'pointer'});
		$(".lay_exist").click(function(){$(this).parent().fadeOut('slow');});
		if(total==1){$('.lay_next, .lay_prev').hide();}
		function change(src,alt){//切换大图函数
			$('.lay_title').html((i+1)+'/'+total+'　'+alt);
			bigPic.fadeOut('300');
			clearTimeout(timer);
			timer=setTimeout(function(){
				bigPic.attr('src',src);
				setTimeout(function(){
					width = bigPic.width();
					height = bigPic.height();
					marginT = ($(window).height()-$('.lay_show img').height())/2+$(document).scrollTop();
					if (marginT<0){marginT=0;}
					$('.lay_show .lay_img').stop().animate({'width': width,'height': height,'marginTop':marginT},300);
					setTimeout(function(){bigPic.stop().fadeIn('300');},400);
				},10);
			},800);
		}
		imgList.click(function(){
			src = $(this).attr('src');
			alt = $(this).attr('alt');
			i = imgList.index(this);
			$('.lay_show').fadeIn('800').css({height:$(document).height()+400});
			change(src,alt);
		});
		function over(){
			$('.lay_over').slideDown(200).delay(800).fadeOut(800);
		}
		//前一张
		function prev(){
			if (i>0){
				src = imgList.eq(--i).attr('src');
				alt = imgList.eq(i).attr('alt');
				change(src,alt);
			}else{over();i=total;}
		}
		//下一张
		function next(){
			if (i<total-1){
				src = imgList.eq(++i).attr('src');
				alt = imgList.eq(i).attr('alt');
				change(src,alt);
			}else{over(); i=-1;}
		}
		//左右键翻页
		$(window).keydown(function(event){
			if($('.lay_show').css('display')=='block'){
				switch(event.keyCode) {
					case 37:prev();
					break
					case 39:next();
					break
					case 27:$('.lay_show').fadeOut('slow');
					break
				}
			}
		});
		$('.lay_next').click(function(){next();});
		$('.lay_prev').click(function(){prev();});
		$('.lay_next, .lay_prev').mouseover(function(){$(this).stop().animate({width:'60'},500)}).mouseout(function(){$(this).stop().animate({width:'40'},500)});
	};
	ex.lantern = init;
})(L);


/*
 * blogList page
 *  
 */
(function(ex){
	var blogTemp = '';
	var getData = function(skip,limit,fn){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/blog',
			'data' : {
				'act' : 'get_list',
				'skip' : skip ,
				'limit' : limit
			},
			'success' :function(d){
				render(d.list,blogTemp);
				fn&fn(d.count);
			}
		});
	};
	var render = function(data,temp){
		var data = data,
			temp = temp;
			var txt = '';
			for(var i in data){
				var date=new Date(parseInt(data[i].time_show));
				data[i].time_show=(date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+date.getDate();
				data[i].cover=data[i].cover||'/images/notimg.gif';
				txt+=temp.replace(/\{-(\w*)-}/g,function(){
					return data[i][arguments[1]]||22222;
				});
			}
			$('.blog_addMore').before(txt);
	};
	var init = function(){
		var count = 100,
			limit = 10,
			skip = 10;
		$.get('/ajax/temp?article_item',function(data){
			blogTemp = data['article_item'];
			$('.blog_addMore').on('click','a',function(){
				if(blogTemp.length>10){
					getData(skip,limit,function(num){
						skip += limit;
						count = num ;
						if(skip>=count){
							$('.blog_addMore').hide();
						}
					});
				}
			});
			$('.articleList').on('click','.dataLike',function(){
				var left = $(this).offset().left-20,
					top = $(this).offset().top-16;
				L.dialog.tips({
					'text':'交互接口开发中……',
					'left':left,
					'top':top,
					'delay':2000
				});
			});
		});
	};
	L.blogList=init;
})(L);


/*
 * shareList page
 *  
 */
(function(ex){
	var init = function(){
		var mod = $('.shareList');
		mod.on('mouseenter','a',function(){
			$(this).find('strong').stop().animate({'bottom':0},200);
		}).on('mouseleave','a',function(){
			$(this).find('strong').stop().animate({'bottom':-100},200);
		});
	}
	L.shareList=init;
})(L);

/*
 *  countTime
 */
(function(ex){
	var init = function(){
		$('.time_count').each(function(){
			var time = parseInt($(this).html());
			var a = new Date(time) - new Date();
			$(this).html(Math.ceil(a/(1000*60*60)));
		});
	}
	L.countTime = init;
})(L);


/*
 * init
 */
(function(){
	var parm=eval('('+$('#initJs').attr('data')+')');
	parm.page=parm.page||'';
	L.gallery();
	L.nav(parm.page);
	switch(parm.page){
		case 'index':
			L.indexNav();
			L.countTime();
			break
		case 'article':
			if($('.codeArea').length>0){$.getScript('/skin/naive/codeArea.js');}
			L.lantern($('.article img'));
			break
		case 'artList' :
			L.blogList();
		case 'shareList' :
	//		L.shareList();
			break
		case 'shareDetail' :
			L.lantern($('.article img'));
			break
		case 'opusList' :
			break
		case 'opusDetail' :
			break
		case 'bless' :
			break
			
	}
	// L.a2Fn($('body'),'/demo/bless.html',function(){
		// L.dialog.pop({'title':'请留言','width':700,'html':'<iframe class="blessFrame" src="/demo/bless.html"></iframe>'});
	// });
	$('.articleList').on('click','.dataLike',function(){
		var classId=$(this).parents('.articleItem').attr('classid');
		var articleId=$(this).parents('.articleItem').attr('articleid');
		//console.log(classId,articleId,$(this).find('b'));
		L.like(classId,articleId,$(this).find('b'));
	});
})();




