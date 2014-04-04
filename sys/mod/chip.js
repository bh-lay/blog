/*
 * @author bh-lay
 *
 *  生成代码段
 * 
 * use	exports.get(modname)		can get template we have defined !
 * use	exports.init(template)		can init all template item !
 */

var juicer = require('juicer');
var fs = require('fs');
var mongo = require('../conf/mongo_connect');

//define template Object
var chip = {};

chip.article_item =function(callback){
	var chip =  ['{@each list as it,index}',
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
				'<div class="artItFoot">',
					'<a class="dataLike" title="我喜欢" href="javascript:void(0)"><i></i><b>8</b></a>',
					'<a class="dataView" title="查看" href="/blog/${it.id}" lofox="true" target="_self"><i></i><b>367</b></a>',
				'</div>',
			'</div>',
			'<div class="artItLace">',
				'<div class="artItLaCircle"></div>',
				'<div class="artItLaCorner"><b></b><i></i></div>',
			'</div>',
		'</div>',
	'{@/each}'].join('');
	callback(chip);
};

chip.share_item = function(callback){
	var chip =  ['{@each list as it,index}',
		'<li>',
			'<a href="/share/${it.id}" title="${it.title}" lofox="true" target="_self" >',
				'<img src="${it.cover}" alt="${it.title}" />',
				'<strong>${it.title}</strong>',
			'</a>',
		'</li>',
	'{@/each}'].join('');
	callback(chip);
};

chip.labs_item = function(callback){
	var chip =  ['{@each list as it,index}',
		'<li>',
			'<a href="/labs/${it.id}" title="${it.title}" lofox="true" target="_self" >',
				'<img src="${it.cover}" alt="${it.title}" />',
				'<strong>${it.title}</strong>',
			'</a>',
		'</li>',
	'{@/each}'].join('');
	callback(chip);
};

chip.labs_detail = function(callback){
	var chip = ['<div class="golCnt"><div class="article labs_detail">',
		'<div class="articletop"><h1>${title}</h1></div>',
			'{@if cover}',
				'<img src="${cover}" alt="${title}" class="topicImg" />',
			'{@/if}',
		'<div class="text md_html">$${content}</div>',
		'<div class="youyan"><!-- UY BEGIN -->',
				'<div id="uyan_frame"></div>',
				'<script type="text/javascript" id="UYScript" src="http://v1.uyan.cc/js/iframe.js?UYUserId=1605927" async=""></script>',
			'<!-- UY END --></div>',
	'</div></div>'].join('');
	callback(chip);
};
chip.opus_item = function(callback){
	var chip =   ['{@each list as it,index}',
		'<li>',
			'<div class="opus_cover">',
				'<a href="/opus/${it.id}" title="${it.title}" target="_self" lofox="true" >',
					'<img src="${it.cover}" alt="${it.title}" />',
				'</a>',
			'</div>',
			'<div class="opus_info">',
				'<h3><a href="/opus/${it.id}" target="_self" lofox="true" >${it.title}</a></h3>',
				'<p><strong>开发范围：</strong>',
					'{@each it.work_range as that,index}',
						'<span>${that}</span>',
					'{@/each}',
				'</p>',
				'<p><strong>在线地址：</strong>',
					'{@if it.online_url}',
						'<a href="${it.online_url}">${it.online_url}</a>',
					'{@else}',
						'<span>无在线地址</span>',
					'{@/if}',
				'</p>',
			'</div>',
		'</li>',
	'{@/each}'].join('');
	callback(chip);
};

chip.opus_detail = function(callback){
	var chip = ['<div class="golCnt">',
		'<div class="TagLine">小剧作品，一次次小小的进步，成就平凡的自己！</div>',
		'<div id="focusTitle">',
			'{@if cover}',
				'<img src="${cover}" alt="${title}" class="topicImg" />',
			'{@/if}',
			'<div class="info">',
				'<h1>${title}</h1>',
				'<ul>',
					'<li><strong>创作时间:</strong>${opus_time_create}</li>',
					'<li><strong>相关页面:</strong><a href="#" title="字段暂无" target="_blank">字段暂无</a></li>',
				'</ul>',
			'</div>',
		'</div>',
		'<div class="opus_detail">',
			'<div class="photo"><img src="${opus_pic}" alt="${title}" /></div>',
			'<div class="text">$${content}</div>',
			'<div class="youyan"><!-- UY BEGIN -->',
				'<div id="uyan_frame"></div>',
				'<script type="text/javascript" id="UYScript" src="http://v1.uyan.cc/js/iframe.js?UYUserId=1605927" async=""></script>',
			'<!-- UY END --></div>',
		'</div>',
	'</div>'].join('');
	callback(chip);
};

chip.nav = function(callback){
	var chip =  ['<div class="navLayer">',
		'<div class="nav_bj"></div>',
		'<div class="nav_main">',
			'<div class="l_row">',
				'<a class="nav_logo" lofox="true" href="/">小剧客栈</a>',
				'<div class="nav_mainList">',
					'<ul class="nav">',
						'<li page="blog"><a lofox="true" title="博客" href="/blog/">博客</a></li>',
						'<li page="share"><a lofox="true" title="分享" href="/share/">分享</a></li>',
						'<li page="labs"><a lofox="true" title="小剧的实验室" href="/labs/">实验室</a></li>',
						'<li page="opus"><a lofox="true" title="小剧作品" href="/opus/">作品</a></li>',
					'</ul>',
					'<ul class="navLink">',
						'<li><a title="创业团" target="_blank" href="/topic/intiate.html">创业团</a></li>',
						'<li><a title="给剧中人留言" target="_blank" href="/demo/bless.html">留言</a></li>',
					'</ul>',
				'</div>',
			'</div>',
			'<div class="nav_tool">',
				'<a class="nav_moreBtn" href="javascript:void(0)"><span class="nav_Btn_ico"></span><span class="nav_Btn_ico"></span><span class="nav_Btn_ico"></span></a>',
			'</div>',
		'</div>',
	'</div>'].join('');
	callback(chip);
};

//tongji template
chip.tongji = function(callback){
	var chip =  ['<div class="tongji">',
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
	'</div>'].join('');
	callback(chip);
}

//youyan commit
chip.youyan = function(callback){
	var chip =  ['<!-- UY BEGIN -->',
		'<div id="uyan_frame"></div>',
		'<script type="text/javascript">var uya n_config = {"du":"bh-lay.com"};</script>',
		'<script type="text/javascript" id="UYScript" src="http://v1.uyan.cc/js/iframe.js?UYUserId=1605927" async=""></script>',
	'<!-- UY END -->'].join('');
	callback(chip);
};

chip.index = function(callback){
	var this_tpl = ['<div class="indeCnt">',
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
								'<div class="wrPlItTitle"><strong>用CSS3润色的table表格</strong><span>2013年7月26日前完成</span></div>',
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
							'<div class="wrPlItem"><a href="/blog/13ff0cdf1a0" lofox="true">',
								'<div class="wrPlItTitle"><strong>placehold的方法及实现</strong><span>2013年7月18前完成</span></div>',
								'<div class="wrPlItCount"><span>推迟</span><strong>18</strong><span>h 完成</span></div>',
							'</a></div>',
							'<div class="wrPlItem"><a href="/blog/13fcb0f8b68" lofox="true">',
								'<div class="wrPlItTitle"><strong>layUI有关select的实现</strong><span>2013年7月10日完成</span></div>',
								'<div class="wrPlItCount"><span>推迟</span><strong>6</strong><span>h 完成</span></div>',
							'</a></div>',
							'<div class="wrPlItem"><a href="/blog/13f4b2a16e8" lofox="true">',
								'<div class="wrPlItTitle"><strong>新版 - 博客基本功能实现、数据迁移及上线</strong><span>2013年6月22日完成</span></div>',
								'<div class="wrPlItCount"><span>提前</span><strong>13</strong><span>h 完成</span></div>',
							'</a></div>',
						'</div>',
					'</div>',
					'<div class="inNavCntItem">',
						'<div class="webLink">',
							'{@each friend_list as it,index}',
	 							'<a target="_blank" href="${it.url}">${it.title}</a>',
							'{@/each}',
						'</div>',
					'</div>',
				'</div>',
				'<div class="inNavBtn">',
					'<span>博文计划</span><span>最近完成</span><span>我的博友</span>',
				'</div>',
			'</div>',
		'</div>',
	'</div>'].join('');
	
	var method = mongo.start();
	method.open({'collection_name':'blog_friend'},function(err,collection){
		collection.find({}, {limit:20}).toArray(function(err, docs) {
			var chip = juicer(this_tpl,{'friend_list':docs})
			
			callback(chip);
			method.close();
		});
	});
};

//method get
function get(mod,callback) {
	var mod = mod||'';
	//filter forbidden code: . /
	mod = mod.replace(/\/|\./g,'');
	
	if(chip[mod]){
		cache.chip(mod,function(this_cache){
			callback(this_cache);
		},function(save_cache){
			chip[mod](function(this_chip){
				save_cache(this_chip);
			});
		});
	}else{
		callback('');
	}
}

//get chip
exports.get = get;
exports.produce = function(mod_name,data,callback){
	var redata = '';
	get(mod_name,function(chip){
		if(chip){
			redata = juicer(chip,data);
		}
		callback(redata);
	});
}