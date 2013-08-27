/**
 * 弹框
 * L.dialog
 *   L.dialog.tips({'html','width','text'});
 */

var L = L||{};

(function(ex){
	var style = ['<style type="text/css" rel="stylesheet">',
		'.diaPop{z-index: 1000000;position: absolute;top:0px;display: none;background:#fff;border-radius: 8px;overflow: hidden;border:1px solid #ccc;box-shadow: 2px 2px 4px #aaa;}',
		'.diaPopCpt{height:30px;line-height:30px;background: #f2f2f2;}',
		'.diaPopCnt{background: #fff;}',
		'.popWin .layClose{height:17px;width:17px;background:#555;border-radius:10px;cursor: pointer;position:absolute;right:5px;top:5px;color:#ccc;text-align:center;line-height:17px;font-size:14px;}',
		'.popWin .layClose:hover{color:#c00;}',
		'.diaTips{z-index: 1000000;position: absolute;display: none;background:rgba(0,0,0,0.7);_background:#444;cursor: default;}',
		'.diaTipsCnt{padding:10px 25px;line-height:20px; font-size:18px;color:#fff;text-align: center;}',
		'.popWin{z-index: 1000000;position: absolute;top:0px;display: none;}',
		'.popWin .popWinBj{width:100%;height:100%;background: #000;opacity: 0.5;border-radius: 4px;}',
		'.popWin .popWinBody{background: #fff;position:absolute;left:5px;top:5px;}',
		'.popWin .button{width:156px;height: 36px;margin-left:-78px;background: url(skin.png) -500px -190px;text-indent:-29em;overflow:hidden;cursor: pointer;position:absolute;top:125px;left:50%;}',
		'.popWin p{top:50px;color:#333;font-size:14px;padding:30px 20px;}',
		'.popWin .layClose{height:17px;width:17px;background:#555;border-radius:10px;cursor: pointer;position:absolute;right:5px;top:5px;color:#ccc;text-align:center;line-height:17px;font-size:14px;}',
		'.popWin .layClose:hover{color:#c00;}',
		'</style>'
	].join('');
	$(function(){
		$('head').append(style);
	});
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