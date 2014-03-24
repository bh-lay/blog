
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
	ex.index = function(dom,callback){
		console.log('index page:','start render index page !');
		var param = param || {};
			
//		if(param['init']){
			console.log('index page:','get index page template!');

			L.require('/frontEnd/public/css/index.css');
			$.get('/ajax/temp?index',function(data){
				var this_dom = $(data['index']);
				dom.html(this_dom);
				indexPanel(dom);
				countTime(dom);
				fn&&fn();
			});
//		}else{
//			indexPanel(dom);
//			countTime(dom);
//		}
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
	ex.blogList = function(dom,param){
		console.log('blog list page:','start !');
		
			dom.html('<div class="articleList"></div>');
			skip = 0;
			L.require('juicer,/frontEnd/public/css/blog.css',function(){
				init(dom,function(){
					getData(function(){
				//		render_over&&render_over();
					});
				});
			});

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
	ex.blogDetail=function(dom,param){
		var param = param || {},
			 id = param['id'] || null,
			 render_over = this.render_over || null;
		
	//	if(param['init']){
			L.require('juicer,/frontEnd/public/css/blog.css',function(){
				getData(id,function(html,title){
					html&&dom.html(html);
					render_over&&render_over(title);
				});
			});
	//	}
		
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
	ex.shareList = function(dom,param){
		var temp = ['{@each list as it,index}<li><a href="/share/${it.id}" title="${it.title}" lofox="true" target="_self" >',
			'<img src="${it.cover}" alt="${it.title}" />',
			'<strong>${it.title}</strong>',
		'</a></li>{@/each}'].join('');
		
		L.require('juicer,/frontEnd/public/css/share.css',function(){
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
				});
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
				//	L.dialog.tips('分享不存在！');
					lofox.push('/share',{render:false});
					fn&&fn();
				}
			}
		});
	};
	ex.shareDetail=function(dom,id){
		var render_over = this.render_over || null;
		
	//	if(param['init']){
			var dom = dom || $('.contlayer'),
				 id = id || null;
			L.require('juicer,/frontEnd/public/css/share.css,/frontEnd/lib/showdown/style-0.6.4.min.css',function(){
				getData(id,function(html,title){
					html&&dom.html(html);
					render_over&&render_over(title);
				});
			});
	//	}
		
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
	ex.opusList = function(dom,param){
		var render_over = this.render_over || null;
		
		L.require('juicer,/frontEnd/public/css/opus.css',function(){
			$.get('/ajax/temp?opus_item',function(data){
				var temp = data['opus_item'];
	//			if(param['init']){
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
		//		}else{
	//				start();
	//			}
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
				//	L.dialog.tips('作品不存在！');
			//		L.push('/opus');
					fn&&fn();
				}
			}
		});
	};
	ex.opusDetail=function(dom,id){
		var render_over = this.render_over || null;
		var param = param || {},
			 dom = dom || $('.contlayer'),
			 id = id || null;
				 
	//	if(param['init']){
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
	//	}
		
	};
})(render);


/**
 * labs list
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
			'url' : '/ajax/labs',
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
	ex.labsList = function(dom,param){
//		if(!param['init']){
//			return
//		}
		L.require('juicer,/frontEnd/public/css/labs.css',function(){
			$.get('/ajax/temp?labs_item',function(data){
				var temp = data['labs_item'];
				skip = 0;
				dom.html('<div class="golCnt"><div class="labsList"><ul></ul></div></div>');
				getData(function(list){
					var this_html = juicer(temp,{'list':list}),
						this_dom = dom.find('.labsList ul');
					insert({
						'end' : (skip>=count)?true:false,
						'html' : this_html,
						'dom' : this_dom
					});
					start();
				});
			});
		});
	};
})(render);


/**
 * labs detail
 *  
 */
(function(ex){	
	function getData(id,fn){
		$.ajax({
			'type' : 'GET' ,
			'url' : '/ajax/labs',
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
					L.dialog.tips('试验品不存在！');
					lofox.push('/opus',{render:false});
					fn&&fn();
				}
			}
		});
	};
	ex.labsDetail=function(dom,id){
		var render_over = this.render_over || null;
		var param = param || {},
			 id = id || null;
		
//	if(param['init']){
			L.require('juicer,/frontEnd/public/css/labs.css',function(){
				$.get('/ajax/temp?labs_detail',function(data){
					var template = data['labs_detail'];
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
	//	}
		
	};
})(render);
