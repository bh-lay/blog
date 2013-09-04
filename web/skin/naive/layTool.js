/**
 * @author:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/


var L=L||{};

/*
 * page background
 * L.gallery() 
 */
(function(ex){
	var config = {
		'delay' : 40000
	};
	
	function JS_show(data,bj){
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
					console.log('not support -webkit-animation');
					newPic.hide().fadeIn(1000);
				}else{
					console.log('support -webkit-animation');
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
			data = eval('('+bj.html()+')');
		if (L.supports('backgroundSize')){
			CSS3(data,bj);
			console.log('use css3')
		}else{
			JS_show(data,bj);
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
	ex.like = function(type,id,obj){
		L.require('dialog',function(){
			init(type,id,obj);
		});
	}
}(L));

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
					moving = false;
					oldIndex = null;
				});
			},200);
		})
	}
	ex.indexNav=init;
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
				var list = d.list;
				var this_html = juicer(blogTemp,{'list':list});
				$('.blog_addMore').before(this_html);
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
		var add_btn_tpl = ['<div class="blog_addMore">',
			'<a href="javascript:void(0)">加载更多</a>',
			'<span>正在加载……</span>',
		'</div>'];
		var add_btn = $(add_btn_tpl.join(''));
		$('.articleList').append(add_btn);
		$.get('/ajax/temp?article_item',function(data){
			blogTemp = data['article_item'];
			add_btn.on('click','a',function(){
				add_btn.addClass('blog_addMore_loading');
				if(blogTemp.length>10){
					getData(skip,limit,function(num){
						add_btn.removeClass('blog_addMore_loading');
						skip += limit;
						count = num ;
						if(skip>=count){
							add_btn.hide();
						}
					});
				}
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
	L.blogList=function(){
		//
		L.require('juicer',function(){
			init();
		});
	};
})(L);


/**
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
			a = (a<0)?0:a;
			$(this).html(Math.ceil(a/(1000*60*60)));
		});
	}
	L.countTime = init;
})(L);


/*
 * init
 */
(function(){
	var parm = eval('('+$('#initJs').attr('data')+')');
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
			L.require('lantern',function(){
				L.lantern($('.article img'));
			});
			break
		case 'artList' :
			L.blogList();
		case 'shareList' :
	//		L.shareList();
			break
		case 'shareDetail' :
			L.require('lantern',function(){
				L.lantern($('.article img'));
			});
			break
		case 'opusList' :
			break
		case 'opusDetail' :
			break
		case 'bless' :
			break
			
	}

	$('.articleList').on('click','.dataLike',function(){
		var classId=$(this).parents('.articleItem').attr('classid');
		var articleId=$(this).parents('.articleItem').attr('articleid');
		//console.log(classId,articleId,$(this).find('b'));
		L.like(classId,articleId,$(this).find('b'));
	});
})();




