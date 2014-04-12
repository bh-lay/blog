
/**
 * render
 * 
 */

//index page
define(function(require,exports){
	require('/frontEnd/public/css/index.css');
	
	var temp = '<div class="indeCnt"><div class="l_row"><div class="layIntroCnt"><div class="layIntro layIntroA"><span>我是</span><strong>剧中人</strong></div><div class="layIntro layIntroB">90后·天蝎男</div><div class="layIntro layIntroC">喜欢拆卸，喜欢代码，喜欢设计</div><div class="layIntro layIntroD">喜欢一切有创造力的事情</div><div class="laySnsLink"><a target="_blank" class="sns_qq" title="QQ" href="http://sighttp.qq.com/authd?IDKEY=add2a4ef1d41f5d9014a7162fd89e6343c31c38ccbf9cc6f"><span>扣扣</span></a><a target="_blank" class="sns_weibo" title="新浪微博" href="http://weibo.com/bhlay"><span>微博</span></a><a target="_blank" class="sns_google" title="Google+" href="https://plus.google.com/117302426559268025818/"><span>谷歌+</span></a><a target="_blank" class="sns_zhanku" title="站酷" href="http://www.zcool.com.cn/u/684057/"><span>站酷</span></a></div></div><div class="indexNav"><div class="inNavCnt"><div class="inNavCntItem"><div class="wrPlCnt"><div class="wrPlItem"><div class="wrPlItTitle"><strong>用CSS3润色的table表格</strong><span>2013年7月26日前完成</span></div><div class="wrPlItCount"><span>剩余</span><strong class="time_count">1374742712440</strong><span>h</span></div></div><div class="wrPlItem"><div class="wrPlItTitle"><strong>前后端公用模版的实现</strong><span>2013年8月5日前完成</span></div><div class="wrPlItCount"><span>剩余</span><strong class="time_count">1375690414597</strong><span>h</span></div></div></div></div><div class="inNavCntItem"><div class="wrPlCnt"><div class="wrPlItem"><a href="/blog/13ff0cdf1a0" lofox="true"><div class="wrPlItTitle"><strong>placehold的方法及实现</strong><span>2013年7月18前完成</span></div><div class="wrPlItCount"><span>推迟</span><strong>18</strong><span>h 完成</span></div></a></div><div class="wrPlItem"><a href="/blog/13fcb0f8b68" lofox="true"><div class="wrPlItTitle"><strong>layUI有关select的实现</strong><span>2013年7月10日完成</span></div><div class="wrPlItCount"><span>推迟</span><strong>6</strong><span>h 完成</span></div></a></div><div class="wrPlItem"><a href="/blog/13f4b2a16e8" lofox="true"><div class="wrPlItTitle"><strong>新版 - 博客基本功能实现、数据迁移及上线</strong><span>2013年6月22日完成</span></div><div class="wrPlItCount"><span>提前</span><strong>13</strong><span>h 完成</span></div></a></div></div></div><div class="inNavCntItem"><div class="webLink"><a target="_blank" href="http://www.w3cfuns.com/">前端开发网(W3Cfuns.com)</a><a target="_blank" href="http://wz.68design.net/">设计名站</a><a target="_blank" href="http://www.w3clover.com">W3C爱好者</a><a target="_blank" href="http://www.z990.com">小林Design</a><a target="_blank" href="http://www.zhuwenlong.com/">Mofei梦的起飞</a><a target="_blank" href="http://www.zeroisstart.com/">随遇而安</a><a target="_blank" href="http://www.hankewins.com/">前端生活</a><a target="_blank" href="http://www.woween.com">何东杰的网络日记</a><a target="_blank" href="http://www.yajee.net">前端ING</a></div></div></div><div class="inNavBtn"><span>博文计划</span><span>最近完成</span><span>我的博友</span></div></div></div></div>';
	
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
	return function(dom,callback){
		console.log('index page:','start render index page !');
		var param = param || {};
			
//		if(param['init']){
			console.log('index page:','get index page template!');

			
				var this_dom = $(temp);
				dom.html(this_dom);
				indexPanel(dom);
				countTime(dom);
		
//		}else{
//			indexPanel(dom);
//			countTime(dom);
//		}
	};
});