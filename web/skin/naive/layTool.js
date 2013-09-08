/**
 * @author:bh-lay
 * Blog : http://bh-lay.com/
 * Copyright (c) 2012-2018
**/

/**
 * page background
 * L.gallery() 
 */
(function(ex){
	var config = {
		'delay' : 40000
	};
	
	function JS_show(data,bj){
		console.log('gallery:','use JS animate !');
		var data = data,
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
					},config.delay)
				});
			}});
		}
	}
	function CSS3(data,bj){
		console.log('gallery:','use css3 mask and animate!');
		var data = data,
			bj = bj,
			total = data.length;
		bj.html('');
		show(0);
		
		function show(index){
			var index = index,
				src = data[index].src;
			L.loadImg(src,{'loadFn':function(){
				var newPic = $('<div class="galBj_mask"></div>');
				newPic.css({'backgroundImage' : 'url(' + src + ')'});
				bj.html(newPic);
				
				if(!L.supports('webkitAnimation')){
					console.log('gallery:','not support -webkit-animation');
					newPic.hide().fadeIn(1000);
				}else{
					console.log('gallery:','support -webkit-animation');
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
		console.log('gallery:','start !');
		var bj = $('.gallayer .galBj'),
			data = eval('('+bj.html()+')');
		if (L.supports('backgroundSize')){
			CSS3(data,bj);
		}else{
			JS_show(data,bj);
		}
	}
}(L));

/**
 * L.nav()
 * 
 */
(function(ex){
	var first = true ;
	var init=function(){
		var delay;
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
	};
	//page:index
	var setCur = function(page){
		switch(page){
			case '':
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
		$('.navLayer .nav li').removeClass('cur');
		$('.navLayer .nav li[page='+page+']').addClass('cur');
	};
	ex.nav = init;
	ex.nav.setCur = setCur;
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
	ex.like = function(type,id,obj){
		L.require('dialog',function(){
			init(type,id,obj);
		});
	}
}(L));

/**
 * L.render({init:true/false});
 * 
 */
L.render = function(param){
	var param = param || {};
		 param['init'] = param['init'] ||false;
	function parse_url(){
		var pathname = window.location.pathname;
			 pathname = pathname.replace(/^\/|\/$/g,'');
		var path_node = pathname.split(/\//);
		//path_node.shift();
		(path_node[0].length<1)&&(path_node[0] = '/')
		return path_node;
	}
	
	var module = parse_url();
	console.log('hello i\'m module :',module);
	switch(module[0]){
		case '/':
			L.render.index(param);
			break
		case 'blog':
			if(module.length == 1){
				L.render.blogList(param);
			}else{
//				L.render.blogDetail(param)
			}
			break
		case 'opus':
//			if(module.length == 1){
//				L.render.opusList(param);
//			}else{
//				L.render.opusDetail(param)
//			}
			break
		case 'share':
			if(module.length == 1){
				L.render.shareList(param);
//			}else{
//				L.render.shareDetail(param)
			}
			break
	}
};

//index page
(function(ex){
	function indexPanel(dom){
		var mod = dom.find('.indexNav');
		var btnMod = mod.find('.inNavBtn span');
		var cntMod = mod.find('.inNavCnt .inNavCntItem');
		var moving = false;
		var oldIndex = null;
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
					moving = false;
					oldIndex = null;
				});
			},200);
		})
	}
	function countTime(dom){
		dom.find('.time_count').each(function(){
			var time = parseInt($(this).html());
			var a = new Date(time) - new Date();
			a = (a<0)?0:a;
			$(this).html(Math.ceil(a/(1000*60*60)));
		});
	}
	ex.index = function(param){
		console.log('render:','start render index page !');
		var param = param || {},
			dom = param['dom'] || $('.contlayer');
			
		if(param['init']){
			console.log('render:','get index page temp!');
			$.get('/ajax/temp?index',function(data){
				dom.html(data['index']);
				indexPanel(dom);
				countTime(dom);
			});
		}else{
			indexPanel(dom);
			countTime(dom);
		}
	};
})(L.render);

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
			'success' :function(data){
				var list = data.list;
				for(var i in list){
					var date = new Date(parseInt(list[i].time_show));
					list[i].time_show = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();
					list[i].cover = list[i].cover || '/images/notimg.gif';
				}
				var this_html = juicer(blogTemp,{'list':list});
				$('.blog_addMore').before(this_html);
				fn&fn(data.count);
			}
		});
	};
	var getTemp = function(fn){
		$.get('/ajax/temp?article_item',function(data){
			blogTemp = data['article_item'];
			fn&&fn(blogTemp);
		});
	}; 
	var init = function(dom){
		var count = 100,
			limit = 10,
			skip = 10;
		var add_btn_tpl = ['<div class="blog_addMore">',
			'<a href="javascript:void(0)">加载更多</a>',
			'<span>正在加载……</span>',
		'</div>'];
		var add_btn = $(add_btn_tpl.join(''));
		dom.find('.articleList').append(add_btn);
		
		getTemp(function(blogTemp){

			add_btn.on('click','a',function(){
				add_btn.addClass('blog_addMore_loading');
				getData(skip,limit,function(num){
					add_btn.removeClass('blog_addMore_loading');
					skip += limit;
					count = num ;
					if(skip>=count){
						add_btn.hide();
					}
				});
			});
			L.require('dialog',function(){
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
		});
	};
	ex.blogList = function(param){
		var param = param || {};
		var dom = param['dom']||$('.contlayer');
		
		if(param['init']){
			L.require('/skin/naive/css/blog.css');
			dom.html('<div class="articleList"></div>');
		}
		L.require('juicer',function(){
			init(dom);
		});
	};
})(L.render);

/**
 * share list
 *  
 */
(function(ex){
	ex.shareList = function(){
		
		$('.shareList').on('mouseenter','a',function(){
			$(this).find('strong').stop().animate({'bottom':0},200);
		}).on('mouseleave','a',function(){
			$(this).find('strong').stop().animate({'bottom':-100},200);
		});
	
		L.require('lantern',function(){
			L.lantern($('.article img'));
		});
	};
})(L.render);


/*
 * all start
 */
console.log('lay:','JS is start working !');
L.require('lofox',function(){
	
	$(function(){
		
		var contlayer = $('.contlayer');
		lofox(function(){
			L.render({init:true,dom:contlayer});
		});
		$('body').on('click','a[lofox="true"]',function(){
			var url = $(this).attr('href');
			console.log(url)
			lofox.push(url);
			return false;
		});
	});
});

$(function(){
	L.nav();
	L.gallery();
	L.render({init:false});
});