/**
 * blogList page
 *  
 */
define(function(require,exports){
	require('/frontEnd/lib/juicer.js');
	require('/frontEnd/public/css/blog.css');
	
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
	
	return function(dom,param){
		console.log('blog list page:','start !');
	
		dom.html('<div class="articleList"></div>');
		skip = 0;
		init(dom,function(){
			getData(function(){
		//		render_over&&render_over();
			});
		});

	};
});