/**
 * @author:bh-lay
 * Blog : http://bh-lay.com/
 * Copyright (c) 2012-2018
**/

/**
 * all start
 */
console.log('lay:','JS is start working !');

L.require('lofox,dialog',function(){
	L.nav();
	L.gallery();
	var contlayer = $('.contlayer');
	var fox = lofox(contlayer,function(url){
		delete(uyan_c_g);
		delete(uyan_loaded);
		delete(uyan_s_g);
		delete(uyan_style_loaded);
		delete(uyan_style_loaded_over);
		window.uyan_config = window.uyan_config || {"du":"bh-lay.com"};
	});
	fox.set('/','小剧客栈_剧中人的个人空间 网页设计师博客 互动设计学习者',function(data){
		L.nav.setCur('/'); 
		render.index.call(this,data);
	});
	fox.set('/blog','我的博客_小剧客栈',function(data){
		L.nav.setCur('blog');
		if(this.path.length == 1){
			render.blogList.call(this,data);
		}else{
			data['id'] = this.path[1];
			render.blogDetail.call(this,data)
		}
	});
	fox.set('/opus','我的作品_小剧客栈',function(data){
		L.nav.setCur('opus');
		if(this.path.length == 1){
			render.opusList.call(this,data);
		}else{
			data['id'] = this.path[1];
			render.opusDetail.call(this,data)
		}
	});
	fox.set('/share','我的分享_小剧客栈',function(data){
		L.nav.setCur('share');
		if(this.path.length == 1){
			render.shareList.call(this,data);
		}else{
			data['id'] = this.path[1];
			render.shareDetail.call(this,data)
		}
	});
	fox.start();
//	if(support){
		$('body').on('click','a[lofox="true"]',function(){
			var url = $(this).attr('href');
			lofox.push(url);
			return false;
		});
//	}
	
	if($.browser.msie){
		if($.browser.version=="6.0"||$.browser.version=="7.0"){
			L.dialog.warning('别用你那高贵的浏览器蹂躏我！');
		}
	}
});

/**
 * L.nav()
 * 
 */
(function(ex){
	var init=function(){
		var delay;
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
				alert(2)
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
					L.dialog.tips('成功啦，灰常感谢！',{'width':'200','callBack':function(){
						obj.html(r[0]);
					}});
				}else if(r[2]!=''){//已经提交
					L.dialog.tips('你已经点过人家啦，换一篇文章吧！',{'width':'200','callBack':function(){
						obj.html(r[0]);
					}});
				}
			}else{
				L.pop({'width':'200','html':r[0]});
			}
		});
	}
	ex.like = function(type,id,obj){
		init(type,id,obj);
	}
}(L));

/**
 * render
 * 
 */
var render = render || {};

//index page
(function(ex){
	function indexPanel(dom){
		console.log('index page:','render index panel !');
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
		console.log('index page:','count time !');
		dom.find('.time_count').each(function(){
			var time = parseInt($(this).html());
			var a = new Date(time) - new Date();
			a = (a<0)?0:a;
			$(this).html(Math.ceil(a/(1000*60*60)));
		});
	}
	ex.index = function(param){
		console.log('index page:','start render index page !');
		var param = param || {},
			 dom = this.dom || $('.contlayer'),
			 fn = this.render_over || null;
			
		if(param['init']){
			console.log('index page:','get index page template!');

			L.require('/skin/naive/css/index.css');
			$.get('/ajax/temp?index',function(data){
				var this_dom = $(data['index']);
				dom.html(this_dom);
				indexPanel(dom);
				countTime(dom);
				fn&&fn();
			});
		}else{
			indexPanel(dom);
			countTime(dom);
		}
	};
})(render);

/**
 * blogList page
 *  
 */
(function(ex){
	var blogTemp = '',
		 add_btn,
		 limit = 10,
		 skip;
	var insert = function (param){
		console.log('blog list page:','insert html !');
		var param = param || {};
		var this_dom = $(param['html']).hide();
		
		if(param['end']){
			add_btn.hide();
		}else{
			add_btn.removeClass('blog_addMore_loading');
		}
		add_btn.before(this_dom);
		
		this_dom.fadeIn(200);
	};
	var getData = function(fn){
		console.log('blog list page:','get data {limit:' + limit+ ',skip:' + skip + '} !');
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/blog',
			'data' : {
				'act' : 'get_list',
				'skip' : skip ,
				'limit' : limit
			},
			'success' :function(data){
				var count = data['count'],
					 list = data['list'];
				for(var i in list){
					var date = new Date(parseInt(list[i].time_show));
					list[i].time_show = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();
					list[i].cover = list[i].cover;
				}
				var this_html = juicer(blogTemp,{'list':list});
				
				skip += limit;
				insert({
					'end' : (skip>=count)?true:false,
					'html' : this_html
				});
				fn&&fn();
			}
		});
	};
	var getTemp = function(fn){
		console.log('blog list page:','get template !');
		$.get('/ajax/temp?article_item',function(data){
			blogTemp = data['article_item'];
			fn&&fn(blogTemp);
		});
	};
	var bindEvent = function(dom){
		console.log('blog list page:','bind event !');
		console.log('blog list page:','add blog btn [more] !');
		var add_btn_tpl = ['<div class="blog_addMore">',
			'<a href="javascript:void(0)">加载更多</a>',
			'<span>正在加载……</span>',
		'</div>'].join('');
		
		add_btn = $(add_btn_tpl);
		dom.find('.articleList').append(add_btn);

		dom.on('click','.blog_addMore',function(){
			add_btn.addClass('blog_addMore_loading');
			getData();
		}).on('click','.dataLike',function(){
			var this_ico = $(this);
			var left = this_ico.offset().left-20,
				 top = this_ico.offset().top-16;
			L.dialog.tips('交互接口开发中……',{
				'left':left,
				'top':top,
				'delay':2000
			});
		});
	};
	var init = function(dom,fn){
		getTemp(function(blogTemp){
			bindEvent(dom);
			fn&&fn();
		});
	};
	ex.blogList = function(param){
		console.log('blog list page:','start !');
		var param = param || {},
			 dom = this.dom || $('.contlayer'),
			 render_over = this.render_over || null;
		
		if(param['init']){
			dom.html('<div class="articleList"></div>');
			skip = 0;
			L.require('juicer,/skin/naive/css/blog.css',function(){
				init(dom,function(){
					getData(function(){
						render_over&&render_over();
					});
				});
			});
		}else{
			skip = limit;
			L.require('juicer',function(){
				init(dom);
			});
		}

	};
})(render);

/**
 * blog detail
 *  
 */
(function(ex){
	var template = ['<div class="golCnt"><div class="article">',
		'<div class="articletop">',
			'<h1>${title}</h1>',
			'<p><span>时间：${time_show} </span><span>作者：${author}</span></p>',
		'</div>',
		'{@if cover}<img src="${cover}" alt="${title}" class="topicImg" />{@/if}',
		'<div class="text md_html">$${content}</div>',
		'<div class="copylink">',
			'<div class="tag"><strong>本文关键字：</strong>${tags}</div>',
			'<div class="pageUrl"><strong>转载请注明来源：</strong>http://bh-lay.com/blog/${id}</div>',
		'</div>',
		'<div class="youyan">',
			'<div id="uyan_frame"></div>',
			'<script type="text/javascript">',
				'var uyan_config = {"du":"bh-lay.com"};',
			'</script>',
			'<script type="text/javascript" id="UYScript" src="http://v1.uyan.cc/js/iframe.js?UYUserId=1605927" async=""></script>',
		'</div>',
	'</div>'].join('');
	
	function getData(id,fn){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/blog',
			'data' : {
				'act' : 'get_detail',
				'id' : id
			},
			'success' :function(data){
				if(data.code == 1){
					var detail = data['detail'];
					var date = new Date(parseInt(detail.time_show));
					detail.time_show = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();
					var this_html = juicer(template,detail);
					fn&&fn(this_html,data['detail']['title']);
				}else{
					L.dialog.tips('博客不存在！');
					lofox.push('/blog',{render:false});
					fn&&fn();
				}
			}
		});
	};
	ex.blogDetail=function(param){
		var param = param || {},
			 dom = this.dom || $('.contlayer'),
			 id = param['id'] || null,
			 render_over = this.render_over || null;
		
		if(param['init']){
			L.require('juicer,/skin/naive/css/blog.css',function(){
				getData(id,function(html,title){
					html&&dom.html(html);
					render_over&&render_over(title);
				});
			});
		}
		
	};
})(render);

/**
 * share list
 *  
 */
(function(ex){	
	var limit = 10,
		 skip = 0,
		 count = 0;
	var insert = function(param){
		var this_html = $(param['html']),
			this_dom = param['dom'];

		this_dom.html(this_html);
	};
	var getData = function(fn){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/share',
			'data' : {
				'act' : 'get_list',
				'skip' : skip ,
				'limit' : limit
			},
			'success' :function(data){
				count = data['count'];
				skip += limit;
				
				var list = data['list'];
				fn&&fn(list);
			}
		});
	};
	var start = function(){
		$('.shareList').on('mouseenter','a',function(){
			$(this).find('strong').stop().animate({'bottom':0},200);
		}).on('mouseleave','a',function(){
			$(this).find('strong').stop().animate({'bottom':-100},200);
		});
	};
	ex.shareList = function(param){
		var render_over = this.render_over || null;
		var dom = this.dom;
		var temp = ['{@each list as it,index}<li><a href="/share/${it.id}" title="${it.title}" lofox="true" target="_self" >',
			'<img src="${it.cover}" alt="${it.title}" />',
			'<strong>${it.title}</strong>',
		'</a></li>{@/each}'].join('');
		
		L.require('juicer,/skin/naive/css/share.css',function(){
			if(param['init']){
				skip = 0;
				dom.html('<div class="golCnt"><div class="shareList"><ul></ul></div></div>');
				getData(function(list){
					var this_html = juicer(temp,{'list':list});
					insert({
						'end' : (skip>=count)?true:false,
						'html' : this_html,
						'dom' : dom.find('.shareList ul')
					});
					start();
					render_over&&render_over();
				});
			}else{
				start();
			}
		});
	};
})(render);


/**
 * share detail
 *  
 */
(function(ex){
	var template = ['<div class="golCnt"><div class="article">',
		'<div class="articletop">',
			'<h1>${title}</h1>',
			'<p><span>分享时间：${time_show} </span></p>',
		'</div>',
		'<div class="text">$${content}</div>',
		'<div class="youyan">',
			'<div id="uyan_frame"></div>',
			'<script type="text/javascript">',
				'var uyan_config = {"du":"bh-lay.com"};',
			'</script>',
			'<script type="text/javascript" id="UYScript" src="http://v1.uyan.cc/js/iframe.js?UYUserId=1605927" async=""></script>',
		'</div>',
	'</div></div>'].join('');
	
	function getData(id,fn){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/share',
			'data' : {
				'act' : 'get_detail',
				'id' : id
			},
			'success' :function(data){
				if(data.code == 1){
					var detail = data['detail'];
					var date = new Date(parseInt(detail.time_show));
					detail.time_show = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();
					var this_html = juicer(template,detail);
					fn&&fn(this_html,detail['title']);
				}else{
					L.dialog.tips('分享不存在！');
					lofox.push('/share',{render:false});
					fn&&fn();
				}
			}
		});
	};
	ex.shareDetail=function(param){
		var render_over = this.render_over || null;
		
		if(param['init']){
			var param = param || {},
				 dom = this.dom || $('.contlayer'),
				 id = param['id'] || null;
			L.require('juicer,/skin/naive/css/share.css,/frontEnd/lib/showdown/style-0.6.4.min.css',function(){
				getData(id,function(html,title){
					html&&dom.html(html);
					render_over&&render_over(title);
				});
			});
		}
		
	};
})(render);

/**
 * opus list
 *  
 */
(function(ex){	
	var limit = 20,
		 skip = 0,
		 count = null,
		 dom;

	var insert = function(param){
		var this_html = $(param['html']),
			this_dom = param['dom'];
		this_dom.append(this_html);
	};
	var getData = function(callback){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/opus',
			'data' : {
				'act' : 'get_list',
				'skip' : skip ,
				'limit' : limit
			},
			'success' :function(data){
				count = data['count'];
				skip += limit;
				
				var list = data['list'];
				for(var i = 0,total = list.length;i<total;i++){
					list[i]['work_range'] = list[i]['work_range']?list[i]['work_range'].split(/\,/):['暂未填写'];
				}
				callback&&callback(list);
			}
		});
	};
	var start = function(){
		
		$('.shareList').on('mouseenter','a',function(){
			$(this).find('strong').stop().animate({'bottom':0},200);
		}).on('mouseleave','a',function(){
			$(this).find('strong').stop().animate({'bottom':-100},200);
		});
	};
	ex.opusList = function(param){
		var render_over = this.render_over || null;
		var dom = this.dom;
		
		L.require('juicer,/skin/naive/css/opus.css',function(){
			$.get('/ajax/temp?opus_item',function(data){
				var temp = data['opus_item'];
				if(param['init']){
					skip = 0;
					dom.html('<div class="golCnt"><div class="opusList"><ul></ul></div></div>');
					getData(function(list){
						var this_html = juicer(temp,{'list':list}),
							this_dom = dom.find('.opusList ul');
						insert({
							'end' : (skip>=count)?true:false,
							'html' : this_html,
							'dom' : this_dom
						});
						start();
						render_over&&render_over();
					});
				}else{
					start();
				}
			});
		});
	};
})(render);

/**
 * opus detail
 *  
 */
(function(ex){	
	function getData(id,fn){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/opus',
			'data' : {
				'act' : 'get_detail',
				'id' : id
			},
			'success' :function(data){
				if(data.code == 1){
					var detail = data['detail'];
					var date = new Date(parseInt(detail.opus_time_create));
					detail.opus_time_create = (date.getYear()+1900)+'-'+(date.getMonth()+1)+'-'+ date.getDate();
					
					fn&&fn(detail,detail['title']);
				}else{
					L.dialog.tips('作品不存在！');
					lofox.push('/opus',{render:false});
					fn&&fn();
				}
			}
		});
	};
	ex.opusDetail=function(param){
		var render_over = this.render_over || null;
		var param = param || {},
			 dom = this.dom || $('.contlayer'),
			 id = param['id'] || null;
				 
		if(param['init']){
			L.require('juicer,/frontEnd/lib/showdown/style-0.6.4.min.css',function(){
				$.get('/ajax/temp?opus_detail',function(data){
					var template = data['opus_detail'];
					if(!template){
						console.log('error','get template error !');
						return
					}
					getData(id,function(detail,title){
						var this_html = juicer(template,detail);
						this_html&&dom.html(this_html);
						render_over&&render_over(title);
					});
				});
			});
		}
		
	};
})(render);

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
	
	function JS_show(data,bj){
		console.log('gallery:','use JS animate !');
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
			isWebkit = false,
			bj = bj,
			total = data.length;
		bj.html('');
		show(0);
		
		if(L.supports('webkitAnimation')){
			console.log('gallery:','support -webkit-animation');
			isWebkit = true;
		}
		
		function show(index){
			var index = index,
				src = data[index].src;
			L.loadImg(src,{'loadFn':function(){
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
		console.log('gallery:','start !');
		var bj = $('.gallayer .galBj'),
			data = config['coverData'];
		if (L.supports('backgroundSize')){
			CSS3(data,bj);
		}else{
			JS_show(data,bj);
		}
	}
}(L));