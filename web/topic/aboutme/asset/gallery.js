/////////////////////////////////////////////////
//this is pic gallery
//gallery([{}],0,);
/////////////////////////////////////////
function gallery(json,index){
	return new gallery.init(json,index);
}
(function(exports){
	var console = window.console||{'log':function(){}};
	
	var gallery_tpl = ["<div class='lan_show'>",
		"<style type='text/css'>",
		".lan_show{width:100%;height:100%;position:fixed;left:0px;top:0px;z-index:6000;overflow:auto;cursor:pointer;",
				"background:#888;background:rgba(0,0,0,0.8);",
				"filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#80000000, endColorstr=#90000000);",
				"-ms-filter:'progid:DXImageTransform.Microsoft.gradient(startColorstr=\"#80000000\" endColorstr=\"#90000000\")';",
				"-moz-user-select: none;",
				"-webkit-user-select: none;",
				"-ms-user-select: none;",
				"-khtml-user-select: none;",
			"user-select: none}",
			".lan_img {position:absolute;background:url(loading.gif) no-repeat center center #fff;left:30%;bottom:40%;width:40%;height:20%;}",
			".lan_img img {display:block;width:100%;height:100%;background:#fff;}",
			".lan_List{position:absolute;z-index:0;left:0px;bottom:0px;width:100%;height:88px;padding-top:28px;overflow:hidden;cursor:default}",
			".lan_List_cnt{display:block;height:88px;position:relative;left:0px;}",
			".lan_List_cnt a{display:block;float:left;width:84px;height:84px;background:#333;border:2px solid #000;position:relative;}",
			".lan_List_cnt a span{width:84px;height:84px;border:none;position:absolute;left:0px;top:0px;",
				"background-color:#333;",
				"background-size:cover;",
				"background-repeat:no-repeat;",
				"background-position:center center;",
				"transition: ease-in 0.08s;",
				"-moz-transition-duration: ease-in 0.08s;",
				"-webkit-transition-duration: ease-in 0.08s;",
				"-o-transition-duration: ease-in 0.08s;}",
			".lan_List_cnt a:hover{border-color:#fff;}",
			".lan_List_cnt a span img{display:block;width:100%;height:100%}",
			".lan_List_cnt a.cur{border-color:#000;cursor:default;z-index:10}",
			".lan_List_cnt a.cur span{width:100px;height:100px;top:-16px;left:-8px;background-color:#666;}",
			".lan_exist {background-color:#4c4c4c;color:#fff;cursor:pointer;font-size:20px;width:26px;height:26px;line-height:26px;position:absolute;right:-13px;top:-13px;border-radius:15px;z-index: 100;text-align:center;}",
			".lan_exist:hover {background-color: #444; color: #f00;}",
		"</style>",
		"<div class='lan_img'>",
			"<div class='lan_exist'>×</div>",
			"<img src='' />",
		"</div>",
		"<div class='lan_List'>",
			"<div class='lan_List_cnt'>",
			"</div>",
		"</div>",
	"</div>"].join('');
	
	
	var public_changeID = 0,
		 public_win = $(window),
		 public_winH = public_win.height(),
		 public_winW = public_win.width();
	
	//load image
	function loadImg(src,parm){
		var parm = parm||{};
		var img = new Image();
		if(parm.errorFn){
			img.onerror = function(){		
				parm.errorFn();
			}
		}
		if(parm.loadFn){
			img.onload = function(){
				parm.loadFn(img.width,img.height);
			}
		}
		if(parm.sizeFn){
			var delay = setInterval(function(){
				if(img.width>1){
					clearInterval(delay);
					parm.sizeFn(img.width,img.height);
				}
			},2)
		}
		
		img.src=src;
	};
	
	//////////////////////////////////////////////////////
	function changePic(){
		var that = this;
		if(this.total == 0){
			this.exist();
			return
		}
		var this_changeID = ++public_changeID;
		
		console.log('gallery:','change picture view !');
		
		var index = this.cur.index,
			 mainPic = this.dom.find('.lan_img img'),
			 changeDelay = 0,
			 list_cntW = null;
		
		this.resetList();
		
		var src = this.json[index]['cover'];
		
		mainPic.stop().fadeTo(70,0);
		clearTimeout(changeDelay);
		changeDelay = setTimeout(function(){
			mainPic.attr('src',src);
			loadImg(src,{
				'loadFn':function(w,h){
					that.cur.width = w;
					that.cur.height = h;
					//console.log('LOOK ME:',this_changeID , private_changeID);
					if(this_changeID == public_changeID){
						that.resize();
					}
				},
				'errorFn':function(){
					console.log('gallery:','pic error !');
					that.cur.width = 40;
					that.cur.height = 40;
					if(this_changeID == public_changeID){
						that.resize();
					}
				}
			});
		},100);
	};
	
	//////////////////////////////////////////////////
	function bindEvent(){
		var that = this;
		console.log('gallery:','bind some events !');
		var winResizeDelay;
		$(window).resize(function(){
			clearTimeout(winResizeDelay);
			winResizeDelay = setTimeout(function(){
				console.log('gallery:','window resizing !');
				public_winH = public_win.height(),
				public_winW = public_win.width(),
				that.resize();
			},200);
		}).on('keydown',function(e){
			if(!that.isactive){
				return
			}
			console.log('gallery:','press key !');
			var key = parseInt(e.keyCode);
			switch(key) {
				case 37:
					that.prev();
					break
				case 39:
					that.next();
					break
				case 27:
					that.exist();
					break
			}
		});
		
		// bind this gallery event
		var except = false ;
		function check_mouse(event){
			var area = null;
			if(except || event.clientY > public_winH - 160){
				area = null;
				except = false;
			}else	if(event.clientX < public_winW/2){
				area = 'left';
			}else{
				area = 'right';
			}
			return area ;
		}
		
		this.dom.on('click',function(e){
			var this_area = check_mouse(e);
			if(this_area == 'left'){
				that.prev()
			}else if(this_area == 'right' ){
				that.next()
			}
		}).on('mousemove','.lan_exist,.lan_List,.lan_to_cnt',function(){
			except = true ;
		}).on('click','.lan_exist',function(){
			that.exist();		
		}).on('click','.lan_List_cnt a',function(){
			that.cur.index = $(this).index();
			changePic.call(that);
		});
	
	}
		
	//////////////////////////////////////////////////////
	var init = function(json,index){
		console.log('gallery:','Calculate the initial parameters !');
		var dom_html = gallery_tpl;
		var this_gal = this;
		
		this.isactive = true
		this.json = json;
		this.total = json.length;
		this.dom = $(dom_html);
		this.cur = {
			'index' : index || 0,
			'width' : null,
			'height' : null
		};
		
		console.log('gallery:','define global variable');
		var private_bottomH = 160,
			 private_list_cnt = this.dom.find('.lan_List_cnt');

		

		/////////////////////////////////////////////////////
		function render_thumb(){
			var picList = '';
			for(var s = 0;s < this_gal.total;s++){
				picList += "<a href='javascript:void(0)'><span data-src='" + this_gal.json[s]['thumb'] + "'></span></a>";
			}
			private_list_cnt.html(picList);
			
			console.log('gallery:','loading thumbnail!');
			private_list_cnt.find('span').each(function(){
				var this_dom = $(this);
				var src = this_dom.attr('data-src');
		//		console.log(src);
	//			loadImg(src,{'loadFn':function(w,h){
					//this_dom.html('<img src="' + src + '" />');
		//			this_dom.html('<img src="' + src + '" />');
					this_dom.css('backgroundImage','url(\"' + src + '\")');
		//		}});
			});
		}
		///////////////////////////////////////////////////////
		this.exist = function(){
			this.isactive = false;
			this.dom.fadeOut(150,function(){
				$(this).remove();
			});
		};
		////////////////////////////////////////////
		this.next = function(){
			if(this.total == 1){
				return
			}
			if (this.cur.index >= this.total-1){
				this.cur.index = 0;
			}else{
				this.cur.index++;
			}
			changePic.call(this);
		};
		this.prev = function(){
			if(this.total == 1){
				return
			}
			if (this.cur.index <= 0){
				this.cur.index = this.total-1;
			}else{
				this.cur.index--
			}
			changePic.call(this);
		};
		this.resize = function(){
			var w = this_gal.cur.width,
				 h = this_gal.cur.height,
				 mainPicCnt = this_gal.dom.find('.lan_img'),
				 mainPic = mainPicCnt.find('img');
			
			if(h>public_winH-private_bottomH){
				var newH = public_winH - private_bottomH -30;
				w = newH*w/h;
				h = newH;
			}
			if(w > public_winW-200){
				var newW = public_winW - 200;
				h = newW*h/w;
				w = newW;
			}
			var Bottom =  (public_winH + private_bottomH - h)/2,
			Left = (public_winW - w)/2;
		
			(Left<0)&&(Left=0);
			mainPicCnt.animate({
              width: w,
              height: h,
              bottom: Bottom,
              left: Left
            },100,function(){
				mainPic.stop().fadeTo(80,1);
			});
			mainPic.css({
              width: w,
              height: h
            });
			this_gal.resetList();
		};
		/////////////////////////////////////////////////////
		this.resetList = function (){
			var index = this_gal.cur.index;
			
			list_cntW = 88*this_gal.total;
			private_list_cnt.width(list_cntW);
			
			private_list_cnt.find('a').removeClass('cur').eq(index).addClass('cur');
			if(list_cntW > public_winW){
				var left = parseInt(private_list_cnt.css('left')) + public_winW/2-private_list_cnt.find('.cur').offset().left-44;
				if(left > 0){
					left = 0;
				}
				if(list_cntW + left < public_winW){
					left = public_winW-list_cntW;
				}
				private_list_cnt.animate({'left':left},80);
			}else{
				private_list_cnt.css({'left' : public_winW/2 - list_cntW/2},80);
			}
		};
		
		
		// start ////////////////////////////////////
		if(this.total == 0){
			console.log('gallery:','stop list does not exist !');
			return
		}
		$('body').append(this.dom).hide().fadeIn(400);
		bindEvent.call(this);
		render_thumb();
		changePic.call(this);
	};
	
	init.prototype = {
		'del' : function(){
			if(this.total == 1){
				this.exist();
				return
			}
			
			this.dom.find('.lan_List_cnt a.cur').remove();
			this['json'].splice(this['cur']['index'],1);
			this.total--;
			this.next();
		},
		'rename' : function(name){
			var index = this['cur']['index'];
			var cover = this['json'][index]['cover'];
			var path_part = cover.match(/(.+\/).+$/);
			if(path_part){
				this['json'][index]['cover'] = path_part[1] + name;
			}
		},
		'change_active':function(check){
			if(typeof(check) == "boolean" ){
				this.isactive = check;
			} 
		}
	};
	exports.init = init;
})(gallery);