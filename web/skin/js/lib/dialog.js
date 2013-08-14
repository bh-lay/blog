/**
 * 弹框
 * L.dialog
 *   L.dialog.tips({'html','width','text'});
 */

var L = L||{};

(function(ex){
	var pop=function (parm){
		var parm=parm||{},
		w=parm.width||300,
		h=parm.height||'auto',
		title=parm.title||'标题',
		html=parm.html||'请填写内容参数',
		fn=parm.callBack,
		t=parm.top||$(window).scrollTop()+200,
		l=parm.left||300;
		var pop=$('<div class="diaPop"><div class="diaPopCpt"></div><div class="diaPopCnt"></div></div>');
		pop.find('.diaPopCpt').html(title);
		pop.find('.diaPopCnt').html(html);
		pop.find('.layClose').click(function(){
			$(this).parent().remove();
		});
		pop.css({'width': w,'height':h,'top':t,'left':l});
		$('body').append(pop);
		pop.find('.popWinBody').css({'width': w-10,'height':h-10});
		pop.fadeIn('300');
		fn&&fn();
	}
	var tips=function (parm){
		var parm=parm||{},
			text=parm.text||'请填写提示文本',
			fn=parm.callBack,
			t=parm.top||$(window).scrollTop()+200,
			l=parm.left||300,
			delay=parm.delay||2000;
		var pop=$('<div class="diaTips"><div class="diaTipsCnt"></div></div>');
		pop.find('.diaTipsCnt').html(text);
		pop.css({'top':t,'left':l});
		$('body').append(pop);
		pop.fadeIn(100,function(){
			fn&&fn();
		});
		setTimeout(function(){
			pop.fadeOut(300,function(){
				pop.remove();
			});
		},delay)
	}
	ex.pop=pop;
	ex.tips=tips;
})(L.dialog = L.dialog||{});