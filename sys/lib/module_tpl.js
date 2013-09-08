/*
 * @author bh-lay
 * use	exports.get(modname)		can get template we have defined !
 * use	exports.init(template)		can init all template item !
 */

var juicer = require('juicer');
//define template Object
var tpl = {};

tpl.article_item = ['{@each list as it,index}',
	'<div class="articleItem" articleId="${it.id}">',
		'<div class="artItCpt">',
			'<h3><a href="/blog/${it.id}" title="${it.title}"  target="_self" >${it.title}</a></h3>',
			'<p>${it.time_show}</p>',
		'</div>',
		'<div class="artItCnt">',
			'{@if it.cover}',
			'<div class="artItPic">',
				'<a href="/blog/${it.id}" title="${it.title}"  target="_self" >',
					'<img src="${it.cover}" alt="${it.title}" />',
				'</a>',
			'</div>',
			'{@/if}',
			'<div class="artItInfo"><p>${it.intro}</p></div>',
			'<div class="artItTag">${it.tags}</div>',
			'<div class="artItFoot">',
				'<a class="dataLike" title="我喜欢" href="javascript:void(0)"><i></i><b>8</b></a>',
				'<a class="dataView" title="查看" href="/blog/${it.id}" target="_self"><i></i><b>367</b></a>',
			'</div>',
		'</div>',
		'<div class="artItLace">',
			'<div class="artItLaCircle"></div>',
			'<div class="artItLaCorner"><b></b><i></i></div>',
		'</div>',
	'</div>',
'{@/each}'];

tpl.share_item = ['{@each list as it,index}',
	'<li>',
		'<a href="/share/${it.id}" title="${it.title}" target="_self">',
			'<img src="${it.cover}" alt="${it.title}" />',
			'<strong>${it.title}</strong>',
		'</a>',
	'</li>',
'{@/each}'];

tpl.opus_item = ['{@each list as it,index}',
	'<li>',
		'<a href="/opus/${it.id}" title="${it.title}" target="_self">',
			'<img src="${it.cover}" alt="${it.title}" />',
			'<strong>${it.title}</strong>',
		'</a>',
	'</li>',
'{@/each}'];

tpl.nav = ['<div class="navLayer">',
	'<div class="golCnt">',
		'<a class="logo" lofox="true" href="/">小剧客栈</a>',
		'<ul class="nav">',
			'<li page="blog"><a lofox="true" title="博客" href="/blog/">博客</a></li>',
			'<li page="share"><a lofox="true" title="分享" href="/share/">分享</a></li>',
			'<li page="opus"><a lofox="true" title="小剧作品" href="/opus/">作品</a></li>',
		'</ul>',
		'<ul class="navLink">',
			'<li><a title="创业团" target="_blank" href="/topic/intiate.html">创业团</a></li>',
			'<li><a title="给剧中人留言" target="_blank" href="/demo/bless.html">留言</a></li>',
		'</ul>',
	'</div>',
'</div>'];

tpl.gallery = ["[",
	"{'src':'/skin/naive/gallery/coast.jpg','alt':'江边'},",
	"{'src':'/skin/naive/gallery/fish.jpg','alt':'鱼儿'},",
	"{'src':'/skin/naive/gallery/tree.jpg','alt':'树林'},",
	"{'src':'/skin/naive/gallery/bamboo.jpg','alt':'竹子','size':[1400,937]},",
	"{'src':'/skin/naive/gallery/roadtogate.jpg','alt':'校门'},",
"]"];

//tongji template
tpl.tongji = ['<div class="tongji">',
	'<script type="text/javascript">',
		'var _bdhmProtocol = (("https:" == document.location.protocol) ? " https://" : " http://");',
		'document.write(unescape("%3Cscript src=\'\" + _bdhmProtocol + \"hm.baidu.com/h.js%3F0f6bfc1dac208f86e5effd5f2d59027d\' type=\'text/javascript\'%3E%3C/script%3E"));',
	'</script>',
		'//-------------BAIDU↑-------------↓GOOGLE-------------',
	'<script>',
		'(function(i,s,o,g,r,a,m){i[\'GoogleAnalyticsObject\']=r;i[r]=i[r]||function(){',
			'(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),',
			'm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)',
		'})(window,document,\'script\',\'//www.google-analytics.com/analytics.js\',\'ga\');',
		'ga(\'create\', \'UA-42652143-1\', \'bh-lay.com\');',
		'ga(\'send\', \'pageview\');',
	'</script>',
'</div>'];

//youyan commit
tpl.youyan = ['<!-- UY BEGIN -->',
	'<div id="uyan_frame"></div>',
	'<script type="text/javascript">var uyan_config = {"du":"bh-lay.com"};</script>',
	'<script type="text/javascript" id="UYScript" src="http://v1.uyan.cc/js/iframe.js?UYUserId=1605927" async=""></script>',
'<!-- UY END -->'];

tpl.index = ['<div class="indeCnt">',
	'<div class="golCnt">',
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
		'<div class="indexNav">',
			'<div class="inNavCnt">',
				'<div class="inNavCntItem">',
					'<div class="wrPlCnt">',
						'<div class="wrPlItem">',
							'<div class="wrPlItTitle"><strong>用CSS3润色的table表格</strong><span>2013年7月25日前完成</span></div>',
							'<div class="wrPlItCount"><span>剩余</span><strong class="time_count">1374742712440</strong><span>h</span></div>',
						'</div>',
						'<div class="wrPlItem">',
							'<div class="wrPlItTitle"><strong>前后端公用模版的实现</strong><span>2013年8月5日前完成</span></div>',
							'<div class="wrPlItCount"><span>剩余</span><strong class="time_count">1375690414597</strong><span>h</span></div>',
						'</div>',
					'</div>',
				'</div>',
				'<div class="inNavCntItem">',
					'<div class="wrPlCnt">',
						'<div class="wrPlItem"><a href="/blog/13ff0cdf1a0">',
							'<div class="wrPlItTitle"><strong>placehold的方法及实现</strong><span>2013年7月18前完成</span></div>',
							'<div class="wrPlItCount"><span>推迟</span><strong>18</strong><span>h 完成</span></div>',
						'</a></div>',
						'<div class="wrPlItem"><a href="/blog/13fcb0f8b68">',
							'<div class="wrPlItTitle"><strong>layUI有关select的实现</strong><span>2013年7月10日完成</span></div>',
							'<div class="wrPlItCount"><span>推迟</span><strong>6</strong><span>h 完成</span></div>',
						'</a></div>',
						'<div class="wrPlItem"><a href="/blog/13f4b2a16e8">',
							'<div class="wrPlItTitle"><strong>新版 - 博客基本功能实现、数据迁移及上线</strong><span>2013年6月22日完成</span></div>',
							'<div class="wrPlItCount"><span>提前</span><strong>13</strong><span>h 完成</span></div>',
						'</a></div>',
					'</div>',
				'</div>',
				'<div class="inNavCntItem">',
					'<div class="webLink">',
						'<a target="_blank" href="http://www.w3cfuns.com/">前端开发网(W3Cfuns.com)</a>',
						'<a target="_blank" href="http://wz.68design.net/">设计名站</a>',
						'<a target="_blank" href="http://www.w3clover.com">W3C爱好者</a>',
						'<a target="_blank" href="http://www.jqueryasp.com/">专注于前端设计</a>',
						'<a target="_blank" href="http://www.w3develop.com/">W3Dev</a>',
						'<a target="_blank" href="http://www.z990.com">小林Design</a>',
						'<a target="_blank" href="http://www.zhuwenlong.com/">Mofei梦的起飞</a>',
						'<a target="_blank" href="http://www.xmsumi.com">路人甲SUMI</a>',
						'<a target="_blank" href="http://www.zeroisstart.com/">随遇而安</a>',
						'<a target="_blank" href="http://www.shuyangyang.com.cn/">思考者日记 - 束洋洋</a>',
					'</div>',
				'</div>',
			'</div>',
			'<div class="inNavBtn">',
				'<span>博文计划</span><span>最近完成</span><span>我的博友</span>',
			'</div>',
		'</div>',
	'</div>',
'</div>'];

//method get
function get(mod) {
	var mod = mod||'';
	if(tpl[mod]){
		return tpl[mod].join('');
	}else{
		return null;		
	}
}
exports.get = get;

exports.produce = function(mod,data){
	var tpl = get(mod);
	if(tpl){
		return juicer(tpl,data);
	}else{
		return '';
	}
}