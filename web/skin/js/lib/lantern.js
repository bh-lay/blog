/*
 * lantern graphic 
 * L.lantern(picdom);
 * L.lantern.start(json,index);
 */
(function(ex){
	var style = ['<style type="text/css" rel="stylesheet">',
		'.lay_exist {background-color:#ddd;border-radius:15px;color:#fff;cursor:pointer;font-size:20px;height:30px;line-height:30px;position:fixed;right:20px;text-align:center;top:20px;width:30px;z-index: 100;}',
		'.lay_exist:hover {background-color: #444; color: #f00;}',
		'.lay_show{background-color:#888;background-color:rgba(0,0,0,0.8);display:none;left:0px;position:absolute;top:0px;width:100%;text-align:center;z-index:1000;}',
		'.lay_show .lay_img {padding:15px;position:relative;margin:100px auto 10px;display:inline-block;border:1px solid #fff;border-radius:4px;box-shadow:0px 0px 10px #fff;background-color:#bbb;overflow: hidden;}',
		'.lay_show .lay_title{background-color:#888;background-color:rgba(0,0,0,0.6);color:#fff;left:0px;padding:5px 20px;position:absolute; top:40%;}',
		'.lay_next, .lay_prev{display:block;background-color:#eee;width:40px;height:40px;line-height:40px;text-align:center;cursor:pointer; position:fixed;top:50%}',
		'.lay_next{right:0px; border-radius:4px 0px 0px 4px;}',
		'.lay_prev{left:0px; border-radius:0px 4px 4px 0px;}',
		'.lay_next:hover, .prev:hover{background-color:#444;}',
		'</style>'
	].join('');
	
	$(function(){
		$('head').append(style);
	});
	
	function start (json,index){
		var tpl = ["<div class='lay_show'>",
			"<div class='lay_exist'>X</div>",
			"<div class='lay_img'>",
				"<img alt='' src='' />",
				"<div class='lay_title'></div>",
			"</div>",
			"<a class='lay_prev'>《</a>",
			"<a class='lay_next'>》</a>",
		"</div>"].join('');
		
		var i = index,
			json = json,
			total = json.length,
			isShow = true,
			timer;
		
		if($('.lay_show').length==0){
			$('body').append(tpl);
		}
		var mainPic = $('.lay_show>.lay_img>img');
		
		if(total==1){
			$('.lay_next, .lay_prev').hide();
		}
		function change(index){//切换大图函数
			var src = json[index]['src'],
				alt = json[index]['alt'];
			$('.lay_title').html((i+1)+'/'+total+'　'+alt);
			mainPic.fadeOut(300);
			clearTimeout(timer);
			timer = setTimeout(function(){
				mainPic.attr('src',src);
				L.loadImg(src,{'loadFn':function(w,h){
					width = w;
					height = h;
					var marginT = ($(window).height()-h-32)/2+$(document).scrollTop();
					(marginT<0)&&(marginT=0);
					$('.lay_show .lay_img').stop().animate({
						'width': width,'height': height,'marginTop':marginT
					},300,function(){
						mainPic.stop().fadeIn('300');
					});
				}});
			},300);
		}
		
		//前一张
		function prev(){
			if (i<=0){
				i=total;
			}
			change(--i);
		}
		//下一张
		function next(){
			if (i>=total-1){
				i=-1;
			}
			change(++i);
		}
		//左右键翻页
		$(window).keydown(function(e){
			if(isShow){
				switch(e.keyCode) {
					case 37:prev();
					break
					case 39:next();
					break
					case 27:$('.lay_show').fadeOut('slow');
					break
				}
			}
		});
		$('.lay_show').on('click','.lay_next',function(){
			next();
		}).on('click','.lay_prev',function(){
			prev();
		}).on('click','.lay_exist',function(){
			$(this).parent().fadeOut('slow');
			isShow = false;			
		});
		
		//start
		$('.lay_show').fadeIn('800').css({
			height:$(document).height()+400
		});
		change(index)
	}
	var init = function (dom){
		
		var imgDom = dom;
		var json = [];
		imgDom.css({cursor:'pointer'}).each(function(){
	
			json.push({
				'src' : $(this).attr('src'),
				'alt' : $(this).attr('alt')
			});
			
		});
		imgDom.click(function(){
			index = imgDom.index(this);
			start(json,index);
		});
		
	};
	ex.lantern = init;
	ex.lantern.start = start;
})(window.L=window.L||{});
