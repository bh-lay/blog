/*
 * @author bh-lay
 * use	exports.get(modname)		can get template we have defined !
 * use	exports.init(template)		can init all template item !
 */

//define template Object
var tpl = {};

tpl.article_item = ['<div class="articleItem" articleId="{-id-}">',
	'<div class="artItCpt">',
		'<h3><a href="/blog/{-id-}" title="{-title-}"  target="_self" >{-title-}</a></h3>',
		'<p>{-time_show-}</p>',
	'</div>',
	'<div class="artItCnt">',
		'<div class="artItPic">',
			'<a href="/blog/{-id-}" title="{-title-}"  target="_self" >',
				'<img  src="{-cover-}" alt="{-title-}" />',
			'</a>',
		'</div>',
		'<div class="artItInfo"><p>{-intro-}</p></div>',
		'<div class="artItTag">{-tags-}</div>',
		'<div class="artItFoot">',
			'<a class="dataLike" title="我喜欢" href="javascript:void(0)"><i></i><b>8</b></a>',
			'<a class="dataView" title="查看" href="/blog/{-id-}" target="_self"><i></i><b>367</b></a>',
		'</div>',
	'</div>',
	'<div class="artItLace">',
		'<div class="artItLaCircle"></div>',
		'<div class="artItLaCorner"><b></b><i></i></div>',
	'</div>',
'</div>'];

tpl.share_item = ['<li>',
	'<a href="/share/{-id-}" title="{-title-}" target="_self">',
		'<img src="{-cover-}" alt="{-title-}" />',
		'<strong>{-title-}</strong>',
	'</a>',
'</li>'];

tpl.opus_item = ['<li>',
	'<a href="/opus/{-id-}" title="{-title-}" target="_self">',
		'<img src="{-cover-}" alt="{-title-}" />',
		'<strong>{-title-}</strong>',
	'</a>',
'</li>'];

tpl.nav = ['<div class="navLayer">',
	'<div class="golCnt">',
		'<a class="logo" href="/">小剧客栈</a>',
		'<ul class="nav">',
			'<li page="blog"><a title="博客" href="/blog/">博客</a></li>',
			'<li page="share"><a title="分享" href="/share/">分享</a></li>',
			'<li page="opus"><a title="小剧作品" href="/opus/">作品</a></li>',
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

//method get
exports.get = function(mod) {
	if(!mod){
		return 'please input template name ！';
	}else if(tpl[mod]){
		return tpl[mod].join('');
	}else{
		return 'please make sure the template ['+mod+'] have be defined ！';		
	}
}

//method init
exports.init=function(temp){

	var temp=temp;
	var txt='';
	txt=temp.replace(/\{-(\w*)-}/g,function(){
		if(tpl[arguments[1]]){
			return tpl[arguments[1]].join('');
		}else{
			return arguments[0];
		}
	});
	return txt;
}
