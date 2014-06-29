
/**
 * render
 * 
 */

//index page
define(function(require,exports){
	seajs.use('public/css/index.css');
	
	var temp = ['<div class="indeCnt"><div class="l_row"><div class="l_col_12">',
		'<div class="layIntroCnt">',
			'<div class="layIntro layIntroA"><span>我是</span><strong>剧中人</strong></div>',
			'<div class="layIntro layIntroB">90后·天蝎男</div>',
			'<div class="layIntro layIntroC">喜欢拆卸，喜欢代码，喜欢设计</div>',
			'<div class="layIntro layIntroD">喜欢一切有创造力的事情</div>',
			'<div class="laySnsLink">',
				'<a target="_blank" class="sns_qq" title="QQ" href="http://sighttp.qq.com/authd?IDKEY=add2a4ef1d41f5d9014a7162fd89e6343c31c38ccbf9cc6f"><span>扣扣</span></a>',
				'<a target="_blank" class="sns_weibo" title="新浪微博" href="http://weibo.com/bhlay"><span>微博</span></a>',
				'<a target="_blank" class="sns_google" title="Google+" href="https://plus.google.com/117302426559268025818/"><span>谷歌+</span></a>',
				'<a target="_blank" class="sns_zhanku" title="站酷" href="http://www.zcool.com.cn/u/684057/"><span>站酷</span></a>',
			'</div>',
		'</div>',
		'<div class="webLink"><div class="webLinkBar">我的小伙伴</div>',
		'<div class="webLink_cnt">',
			'<a target="_blank" href="http://www.w3clover.com">W3C爱好者</a>',
			'<a target="_blank" href="http://www.z990.com">小林Design</a>',
			'<a target="_blank" href="http://www.zhuwenlong.com/">Mofei梦的起飞</a>',
			'<a target="_blank" href="http://www.hankewins.com/">前端生活</a>',
			'<a target="_blank" href="http://www.woween.com">何东杰的网络日记</a>',
			'<a target="_blank" href="http://www.w3cfuns.com/">前端开发网</a>',
		'</div></div>',
	'</div></div></div>'].join('');
	
	return function(dom,callback){
		var this_dom = $(temp);
		dom.html(this_dom);
		isShow = false;
		dom.find('.webLinkBar').click(function(){
			if(isShow){
				isShow = false;
				$(this).next().slideUp(80);
			}else{
				isShow = true;
				$(this).next().slideDown(80);
			}
		});
	};
});