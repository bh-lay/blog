/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
//alert(window.outerWidth);

define && define(function(require,exports){
	seajs.use('publish/publish.css');
	var article = require('publish/article.js');
	var share = require('publish/share.js');
	var opus = require('publish/opus.js');
	var labs = require('publish/labs.js');
	var friends = require('publish/friends.js');
	var power = require('publish/power.js');
	var user = require('publish/user.js');
	
	var publish_tpl = ['<div class="publish">',
		'<div class="publish_cpt">',
			'<a href="javascript:void(0)" data-type="article" class="active">博文</a>',
			'<a href="javascript:void(0)" data-type="share">分享</a>',
			'<a href="javascript:void(0)" data-type="labs">实验室</a>',
			'<a href="javascript:void(0)" data-type="opus">作品</a>',
			'<a href="javascript:void(0)" data-type="friends">友情链接</a>',
		'</div>',
		'<div class="publish_cnt"></div>',
	'</div>'].join('');
	
	function show_module (dom,cpt_dom,name,id){
		if(name == 'share'){
			share(dom,id);
		}else if(name == 'opus'){
			opus(dom,id);
		}else if(name == 'friends'){
			friends(dom,id);
		}else if(name == 'labs'){
			labs(dom,id);
		}else if(name == 'user'){
			user(dom,id);
		}else{
			//默认为发布文章
			article(dom,id);
		}
	
		cpt_dom.find('a').removeClass('active');
		cpt_dom.find('a[data-type="' + name + '"]').addClass('active');
	
	}
	function INIT(dom,param){
		
		var param = param || {};
		var id = param.id || null;
		var active = param.active || 'article';
		if(active == 'user'){
			show_module(dom,cpt_dom,active,id);
		}else{
			dom.html(publish_tpl);
			var cpt_dom = dom.find('.publish_cpt');
			var cnt_dom = dom.find('.publish_cnt');
			show_module(cnt_dom,cpt_dom,active,id);
			cpt_dom.on('click','a',function(){
				var name = $(this).attr('data-type');
				show_module(cnt_dom,cpt_dom,name,null);
				admin.push('publish/' + name);
			});
		}

	};
	
	
	exports.init = INIT;
	exports.article = article;
	exports.share = share;
	exports.opus = opus;
	exports.labs = labs;
	exports.friends = friends;
	exports.power = power;
	exports.user = user;
});