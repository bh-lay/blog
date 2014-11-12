
/**
 * render
 * 
 */

//index page
define(function(require,exports){
	
	var temp = ['<div class="indeCnt">',
		'<div class="index_intro">',
			'<div class="index_intro_cpt">',
				'<div class="index_intro_logo"><i class="l-icon">&#x0049;</i></div>',
				'<h1 class="index_intro_a">小剧客栈</h1>',
			'</div>',
			'<div class="index_intro_cnt">',
				'<p class="index_intro_b">一个自称是单页面加响应式的个人博客</p>',
				'<p class="index_intro_c">nodeJS强力驱动</p>',
				'<p class="index_intro_d">无耻地没有采用express框架</p>',
			'</div>',
		'</div>',
		'<div class="some_link">',
			'<a title="创业团" target="_blank" href="/topic/intiate/index.html">创业团</a>',
			'<a href="/topic/aboutme/index.html" target="_blank" title="关于剧中人">关于剧中人</a>',
			'<a title="给剧中人留言" href="/bless" lofox="true">留言</a>',
		'</div>',
		'<div class="webLink"><div class="webLink_cpt">我的小伙伴</div>',
		'<div class="webLink_cnt">',
			'<a target="_blank" href="http://www.w3clover.com">W3C爱好者</a>',
			'<a target="_blank" href="http://www.z990.com">小林Design</a>',
			'<a target="_blank" href="http://www.zhuwenlong.com/">Mofei梦的起飞</a>',
			'<a target="_blank" href="http://www.hankewins.com/">前端生活</a>',
			'<a target="_blank" href="http://www.woween.com">何东杰的网络日记</a>',
			'<a target="_blank" href="http://www.w3cfuns.com/">前端开发网</a>',
		'</div></div>',
	'</div>'].join('');
	
	return function(dom,callback){
		var this_dom = $(temp);
		dom.html(this_dom);
	};
});