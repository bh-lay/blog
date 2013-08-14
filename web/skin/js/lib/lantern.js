/*
 * lantern graphic 
 * L.lantern(picdom);
 * L.lantern.start(json,index);
 */
(function(ex){
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
			src,
			alt,
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
			mainPic.fadeOut('300');
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
			},800);
		}
		
		//前一张
		function prev(){
			if (i>0){
				change(--i);
			}else{
				i=total;
			}
		}
		//下一张
		function next(){
			if (i<total-1){
				change(++i);
			}else{
				i=-1;
			}
		}
		//左右键翻页
		$('window').keydown(function(e){
			if($('.lay_show').css('display')=='block'){
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
		}).on('mouseover','.lay_next, .lay_prev',function(){
			$(this).stop().animate({width:'60'},500);
		}).on('mouseover','.lay_next, .lay_prev',function(){
			$(this).stop().animate({width:'40'},500);
		}).on('click','.lay_exist',function(){
			$(this).parent().fadeOut('slow');			
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
