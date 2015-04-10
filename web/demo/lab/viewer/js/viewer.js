/* author bh-lay*/

$(function(){
	viewer.init($('.viewer'));
});
/*
 * pic viewer
 * @ parm
 * need dom
 */
(function(ex){
	var loadImg=function (url,fn){
		fn=fn||{};
		var img =new Image();
		img.onload=function(){
			img.onload =null;
			fn.load&&fn.load(img.width,img.height,url);
		}
		if(fn.size){
			var timer=setInterval(function(){
				if(img.width>0){
					clearInterval(timer)
					fn.size(img.width,img.height,url)
				}
			},10)
		}
		img.src = url;
	}
	var move=function(mod){
		var cnt=mod.find('.viCnt img');
		var loading=mod.find('.viCnt span');
		var zoomCnt=mod.find('.viZoom');
		var zoom=zoomCnt.find('img');
		var clip=mod.find('.viCntClip');
		var cntW=cnt.width();
		var cntH=cnt.height();
		var zoomW=zoom.parent().width();
		var zoomH=zoom.parent().height();
		var actL,actT,actR,actB,clipW,clipH;
		var gap=20;
		var delay;
		function resize(){
			actL=cnt.offset().left-$(window).scrollLeft();
			actT=cnt.offset().top-$(window).scrollTop();
			actR=actL+cntW;
			actB=actT+cntH;
			clipW=clip.width();
			clipH=clip.height();
		}
		function dragImg(top,left){
			clip.css({'top':top,'left':left});
			zoom.css({'marginTop':-zoom.height()*top/cntH,'marginLeft':-zoom.width()*left/cntW});
		}
		mod.on('click','.viBList a',function(){
			var __=$(this).find('img');
			var src=__.attr('dataSrc');
			if(__.attr('dataSize')){
				show()
			}else{
				loading.fadeIn(400);
				loadImg(src,{'load':function(w,h){
					__.attr('dataSize',w+','+h);
					show()
				}})
			}
			function show(){
				loading.fadeOut(100);
				var size=__.attr('dataSize').split(',');
				cnt.attr('src',src).css('top',0);
				zoom.attr('src',src).css({'width':size[0],'height':size[1]});
				__.parent().siblings().removeClass('on');
				__.parent().addClass('on');
				clipW=zoomW*cntW/size[0];
				clipH=zoomH*cntH/size[1];
				clip.css({'width':clipW,'height':clipH});
			}
		}).on('mouseenter','.viCnt',function(e){
			clearTimeout(delay)
			delay=setTimeout(function(){
				zoomCnt.fadeIn(100);
				clip.show();
				cnt.fadeTo(300,0.6)
			},300)
		}).on('mouseleave','.viCnt',function(e){
			clearTimeout(delay)
			delay=setTimeout(function(){
				zoomCnt.fadeOut(50);
				clip.hide();
				cnt.fadeTo(50,1)
			},100)
		}).on('mousemove','.viCnt',function(e){
			resize();
			var x=e.clientX-clipW/2;
			var y=e.clientY-clipH/2;
			var top=y-actT;
			var left=x-actL;
			top<0&&(top=0);
			top>cntH-clipH&&(top=cntH-clipH);
			left<0&&(left=0);
			left>cntW-clipW&&(left=cntW-clipW);
			dragImg(top,left)
		});
		mod.find('.viBList a').eq(0).trigger('click');
		mod.find('.viBList a img').each(function(){
			var __=$(this);
			loadImg(__.attr('dataSrc'),{'load':function(w,h){
				__.attr('dataSize',w+','+h);
			}})
		})
	}
	ex.init=move;
}(window.viewer=window.viewer||{}));



