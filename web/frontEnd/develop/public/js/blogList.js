/**
 * blogList page
 *  
 */
define(function(require,exports){
	require('lib/juicer.js');
	seajs.use('public/css/blog.css');
	var blogTemp =  ['{@each list as it,index}',
		'<div class="articleItem" articleId="${it.id}">',
			'<div class="artItCpt">',
				'<h3><a href="/blog/${it.id}" title="${it.title}" lofox="true" target="_self" >${it.title}</a></h3>',
				'<p>${it.time_show}</p>',
			'</div>',
			'<div class="artItCnt">',
				'{@if it.cover}',
				'<div class="artItPic">',
					'<a href="/blog/${it.id}" title="${it.title}" lofox="true" target="_self" >',
						'<img src="${it.cover}" alt="${it.title}" />',
					'</a>',
				'</div>',
				'{@/if}',
				'<div class="artItInfo"><p>${it.intro}</p></div>',
				'<div class="artItTag">${it.tags}</div>',
			'</div>',
		'</div>',
	'{@/each}'].join('');
	
	var add_btn,
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
				
				fn&&fn(this_html,count);
			}
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
			getData(function(html,count){
				skip += limit;
				insert({
					'end' : (skip>=count)?true:false,
					'html' : html
				});
			});
		}).on('click','.dataLike',function(){
			var this_ico = $(this);
			var left = this_ico.offset().left-20,
				 top = this_ico.offset().top-16;
		});
		var scrollDom = dom.find('.articleListCnt')[0];
		var $scrollBody = dom.find('.articleList');
		function handle(event) {  
			var delta = 0;  
			if (!event) /* For IE. */  
				event = window.event;  
			if (event.wheelDelta) { /* IE/Opera. */  
				delta = event.wheelDelta / 120;  
			} else if (event.detail) {  
				delta = -event.detail / 3;  
			}
			
			var left = parseInt($scrollBody.css('marginLeft'));
			
			left += -100 * delta;
			if(left > 0){
				left = 0;
			}
			$scrollBody.css('marginLeft' ,left);
			
			event.preventDefault && event.preventDefault();  
			event.returnValue = false;  
		}

		scrollDom.addEventListener && scrollDom.addEventListener('DOMMouseScroll', handle, false);
		scrollDom.onmousewheel = scrollDom.onmousewheel = handle;
		
	};
	
	return function(dom,param){
		console.log('blog list page:','start !');
		skip = 0;
		getData(function(html,count){
			dom.html('<div class="articleListCnt"><div class="articleList"></div></div>');
			bindEvent(dom);
			skip += limit;
			insert({
				'end' : (skip>=count)?true:false,
				'html' : html
			});
		});

	};
});