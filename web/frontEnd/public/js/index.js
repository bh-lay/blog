
/**
 * render
 * 
 */

//index page
define(function(require,exports){
	require('/frontEnd/public/css/index.css');
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

			$.get('/ajax/temp?index',function(data){
				var this_dom = $(data['index']);
				dom.html(this_dom);
				indexPanel(dom);
				countTime(dom);
			});
//		}else{
//			indexPanel(dom);
//			countTime(dom);
//		}
	};
});