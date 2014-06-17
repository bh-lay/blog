/**
 * @author bh-lay
 * UI.placeholder()
 * 
 * 
 * 
 * Function depends on
 *		JQUERY
 **/

window.UI = window.UI || {};


(function(exports){
	var formCSS = ['<style type="text/css" data-module="form_UI">',
		'.UI_placeHold{position:absolute;top:0px;left:10px;line-height:26px;color:#888;}',
	'</style>'].join('');
	$(function(){
		$('head').append(formCSS);
	});
	function reCal(inD,plD){
		if(inD.val().length>0){
			plD.hide();
		}else{
			plD.fadeIn(100);
		}
	}
	var placeHold=function(sD,title){
		var inD = sD.find('input').eq(0);//inputDom
		inD.length==0&&(inD=sD.find('textarea'));
		if(inD.length==0){
			return;
		}
		var plW = title || inD.attr('title');//placeHoldWord
		sD.append('<div class="UI_placeHold">'+plW+'</div>');
		var plD = sD.find('.UI_placeHold');//placeHoldDom
		sD.click(function(){
			inD.focus()
		});
		var inputDelay;
		inD.on('keyup keydown focusout change propertychange input paste',function(){
			clearTimeout(inputDelay);
			inputDelay = setTimeout(function(){
				reCal(inD,plD);
			},40);
		});
		setTimeout(function(){
			reCal(inD,plD);
		},100)
		
		if(inD[0].tagName == 'INPUT'){
			plD.css('lineHeight',inD.outerHeight()+'px');
		}
		
		return {'reCal':function(){
			reCal(inD,plD);
		}}
	}
	//
	exports.placeHold = placeHold;

})(window.UI);