/*
 * 作者:剧中人
 * 博客：http://bh-lay.com/
 * Copyright (c) 2012-2018 小剧客栈
**/
//alert(window.outerWidth);

define && define(function(require,exports){
	var article = require('publish/article.js');
	var labs = require('publish/labs.js');
	var friends = require('publish/friends.js');
	var power = require('publish/power.js');
	var user = require('publish/user.js');
	var comment = require('publish/comment.js');
	
	var publish_tpl = ['<br/><div class="publish">',
		'<div class="panel panel-default">',
			'<div class="panel-body">',
				'<div class="publish_cnt"></div>',
			'</div>',
		'</div>',
	'</div>'].join('');
	
	function show_module (dom,name,id,sendFn){
		if(name == 'friends'){
			friends(dom,id,sendFn);
		}else if(name == 'labs'){
			labs(dom,id,sendFn);
		}else if(name == 'user'){
			user(dom,id,sendFn);
		}else if(name == 'comment'){
			comment(dom,id,sendFn);
		}else{
			//默认为发布文章
			article(dom,id,sendFn);
		}
	
	}
	function INIT(dom,param){
		
		var param = param || {};
		var id = param.id || null;
		var active = param.active || 'article';
		var sendFn = param['sendFn'] || null;
		
		dom.html(publish_tpl);
		var cnt_dom = dom.find('.publish_cnt');
		show_module(cnt_dom,active,id,sendFn);
	};
	
	
	exports.init = INIT;
	exports.article = article;
	exports.labs = labs;
	exports.friends = friends;
	exports.power = power;
	exports.user = user;
	exports.comment = comment;
});